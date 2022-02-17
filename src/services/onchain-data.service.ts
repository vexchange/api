import { IERC20ABI } from "@abi/IERC20";
import { VexchangeV2FactoryABI } from "@abi/VexchangeV2Factory";
import { VexchangeV2PairABI } from "@abi/VexchangeV2Pair";
import { IPair, IPairs } from "@interfaces/pair";
import { IToken, ITokens } from "@interfaces/token";
import { IAddressPoints, IRankingItem } from "@interfaces/trading-competition";
import { forwardRef, Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Interval } from "@nestjs/schedule";
import { CoinGeckoService } from "@services/coin-gecko.service";
import { Driver, SimpleNet } from "@vechain/connex-driver";
import { Framework } from "@vechain/connex-framework";
import { Mutex } from "async-mutex";
import { BigNumber, ethers } from "ethers";
import { formatEther, parseUnits } from "ethers/lib/utils";
import { find, times } from "lodash";
import { FACTORY_ADDRESS, WVET } from "vexchange-sdk";

@Injectable()
export class OnchainDataService implements OnModuleInit
{
    private pairs: IPairs = {};
    private ranking: Map<string, BigNumber> = new Map();
    private tokens: ITokens = {};
    private readonly mutex: Mutex = new Mutex();
    private mConnex: Connex | undefined = undefined;
    private mFactoryContract: Connex.Thor.Account.Visitor | undefined = undefined;
    private readonly logger: Logger = new Logger(OnchainDataService.name, { timestamp: true });

    public constructor(
        @Inject(forwardRef(() => CoinGeckoService))
        private readonly coingeckoService: CoinGeckoService,
        private readonly configService: ConfigService,
    ) {}

    private get Connex(): Connex
    {
        if (this.mConnex === undefined) { throw new Error("Connex not initialised"); }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.mConnex!;
    }

    private get FactoryContract(): Connex.Thor.Account.Visitor
    {
        if (this.mFactoryContract === undefined) { throw new Error("FactoryContract not initialised"); }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.mFactoryContract!;
    }

    @Interval(60000)
    private async fetch(): Promise<void>
    {
        const allPairsLengthABI: object = find(VexchangeV2FactoryABI, {
            name: "allPairsLength",
        });
        let method: Connex.Thor.Account.Method = this.FactoryContract.method(allPairsLengthABI);
        const numPairs: number = parseInt((await method.call()).decoded[0]);
        const allPairs: object = find(VexchangeV2FactoryABI, { name: "allPairs" });
        const token0ABI: object = find(VexchangeV2PairABI, { name: "token0" });
        const token1ABI: object = find(VexchangeV2PairABI, { name: "token1" });
        const getReservesABI: object = find(VexchangeV2PairABI, { name: "getReserves" });
        const swapFeeABI: object = find(VexchangeV2PairABI, { name: "swapFee" });
        const platformFeeABI: object = find(VexchangeV2PairABI, { name: "platformFee" });
        const swapEventABI: object = find(VexchangeV2PairABI, { name: "Swap" });

        method = this.FactoryContract.method(allPairs);

        const promises: Promise<void>[] = times(numPairs, async(i: number) =>
        {
            const res: Connex.VM.Output & Connex.Thor.Account.WithDecoded = await method.call(i);
            const pairAddress: string = ethers.utils.getAddress(res.decoded[0]);
            const pairContract: Connex.Thor.Account.Visitor = this.Connex.thor.account(pairAddress);

            const token0Address: string = ethers.utils.getAddress((await pairContract.method(token0ABI).call())
                .decoded[0]);

            const token1Address: string = ethers.utils.getAddress((await pairContract.method(token1ABI).call())
                .decoded[0]);

            const swapFee: string = (await pairContract.method(swapFeeABI).call()).decoded[0];
            const platformFee: string = (await pairContract.method(platformFeeABI).call()).decoded[0];

            const [token0, token1] = await this.mutex.runExclusive(() =>
            {
                return Promise.all([
                    this.fetchToken(token0Address),
                    this.fetchToken(token1Address),
                ]);
            });

            const { reserve0, reserve1 } = (
                await pairContract.method(getReservesABI).call()
            ).decoded;

            const reserve0BN: BigNumber = parseUnits(reserve0, 18 - token0.decimals);
            const reserve1BN: BigNumber = parseUnits(reserve1, 18 - token1.decimals);

            // Accounts for tokens with different decimal places
            const price: BigNumber = (reserve0BN.eq(0) || reserve1BN.eq(0))
                ? ethers.constants.Zero
                : reserve0BN
                    .mul(parseUnits("1")) // For added precision for BigNumber arithmetic
                    .div(reserve1BN);

            const swapEvent: Connex.Thor.Account.Event = pairContract.event(swapEventABI);

            const swapFilter: Connex.Thor.Filter<"event", Connex.Thor.Account.WithDecoded>
                  = swapEvent.filter([]).range({
                      unit: "block",
                      // Since every block is 10s, 8640 blocks will be 24h
                      from: this.Connex.thor.status.head.number - 8640,
                      // Current block number
                      to: this.Connex.thor.status.head.number,
                  });

            let end: boolean = false;
            let offset: number = 0;
            const limit: number = 256;

            let accToken0Volume: BigNumber = ethers.constants.Zero;
            let accToken1Volume: BigNumber = ethers.constants.Zero;

            // Need a while loop because we can only get
            // up to 256 events each round using connex
            while (!end)
            {
                const result: Connex.Thor.Filter.Row<"event", Connex.Thor.Account.WithDecoded>[] =
                    await swapFilter.apply(offset, limit);

                for (const transaction of result)
                {
                    accToken0Volume = accToken0Volume
                        .add(transaction.decoded.amount0In)
                        .add(transaction.decoded.amount0Out);
                    accToken1Volume = accToken1Volume
                        .add(transaction.decoded.amount1In)
                        .add(transaction.decoded.amount1Out);
                }

                if (result.length === limit) { offset += limit; }
                else { end = true; }
            }

            this.pairs[pairAddress] = {
                address: pairAddress,
                token0,
                token1,
                price: formatEther(price),
                swapFee: `${(Number(swapFee) / 100)}%`,
                platformFee: `${(Number(platformFee) / 100)}%`,
                token0Reserve: formatEther(parseUnits(reserve0, 18 - token0.decimals)),
                token1Reserve: formatEther(parseUnits(reserve1, 18 - token1.decimals)),
                token0Volume: formatEther(parseUnits(accToken0Volume.toString(), 18 - token0.decimals)),
                token1Volume: formatEther(parseUnits(accToken1Volume.toString(), 18 - token1.decimals)),
            };
        });
        
        await Promise.all(promises);
        this.calculateUsdPrices();
        this.filterMissingUsdTokens();
    }

    private async fetchToken(address: string): Promise<IToken>
    {
        if (address in this.tokens) return this.tokens[address];

        const nameABI: object = find(IERC20ABI, { name: "name" });
        const symbolABI: object = find(IERC20ABI, { name: "symbol" });
        const decimalsABI: object = find(IERC20ABI, { name: "decimals" });

        const symbol: string = (
            await this.Connex.thor.account(address).method(symbolABI).call()
        ).decoded[0];

        const name: string = (
            await this.Connex.thor.account(address).method(nameABI).call()
        ).decoded[0];

        const decimals: string = (
            await this.Connex.thor.account(address).method(decimalsABI).call()
        ).decoded[0];

        const token: IToken = {
            name,
            symbol,
            contractAddress: address,
            usdPrice: undefined,
            decimals: parseInt(decimals),
        };

        this.tokens[address] = token;
        return token;
    }

    private calculateUsdPrices(): void
    {
        this.tokens[WVET["1"].address].usdPrice = this.coingeckoService.getVetPrice();
        for (const pairAddress in this.pairs)
        {
            const pair: IPair = this.pairs[pairAddress];
            if (pair.token0.symbol !== "WVET" && pair.token1.symbol !== "WVET")
            {
                continue;
            }
            else if (pair.token0.symbol === "WVET")
            {
                this.tokens[pair.token1.contractAddress].usdPrice =
                  this.coingeckoService.getVetPrice() * parseFloat(pair.price);
            }
            else if (pair.token1.symbol === "WVET")
            {
                this.tokens[pair.token0.contractAddress].usdPrice =
                  this.coingeckoService.getVetPrice() / parseFloat(pair.price);
            }
        }
    }

    private filterMissingUsdTokens(): void
    {
        for (const tokenAddress in this.tokens)
        {
            if (this.tokens[tokenAddress].usdPrice === undefined)
            {
                delete this.tokens[tokenAddress];
            }
        }
    }

    public async onModuleInit(): Promise<void>
    {
        const net: SimpleNet = new SimpleNet("https://mainnet.veblocks.net");
        const driver: Driver = await Driver.connect(net);
        this.mConnex = new Framework(driver);

        this.mFactoryContract = this.Connex.thor.account(FACTORY_ADDRESS);

        this.logger.log("Fetching on chain data...");
        await this.fetch();
        this.logger.log("Fetching on chain data completed");
        this.logger.log("Fetching trading competition ranking...");
        await this.fetchTradingCompetitionRanking();
        this.logger.log("Fetching trading competition ranking completed");
    }

    public getAllPairs(): IPairs
    {
        return this.pairs;
    }

    public getPair(pairAddress: string): IPair | undefined
    {
        return this.pairs[pairAddress];
    }

    public getAllTokens(): ITokens
    {
        return this.tokens;
    }

    public getToken(tokenAddress: string): IToken | undefined
    {
        return this.tokens[tokenAddress];
    }

    @Interval(60000)
    public async fetchTradingCompetitionRanking(): Promise<void>
    {
        const swapEventABI: object = find(VexchangeV2PairABI, { name: "Swap" });
        const pairContract: Connex.Thor.Account.Visitor =
            this.Connex.thor.account(
                <string> this.configService.get<string>("tradingCompetition.pairAddress"),
            );
        const swapEvent: Connex.Thor.Account.Event =
        pairContract.event(swapEventABI);

        const swapFilter: Connex.Thor.Filter<"event", Connex.Thor.Account.WithDecoded> = swapEvent
            .filter([])
            .range({
                unit: "block",
                from: this.configService.get<number>("tradingCompetition.fromBlock") || 0,
                to: this.configService.get<number>("tradingCompetition.toBlock") || 0, // eslint-disable-line
            });

        const pointsPerAddress: IAddressPoints = {};
        let end: boolean = false;
        let offset: number = 0;
        const limit: number = 256;
        // Need a while loop because we can only get
        // up to 256 events each round using connex
        while (!end)
        {
            const result: Connex.Thor.Filter.Row<
                "event", Connex.Thor.Account.WithDecoded
            >[] = await swapFilter.apply(offset, limit);

            for (const transaction of result)
            {
                const points: BigNumber =
                    pointsPerAddress[transaction.meta.txOrigin] || ethers.constants.Zero; // eslint-disable-line
                pointsPerAddress[transaction.meta.txOrigin] =
                    points.add(transaction.decoded.amount0In).add(transaction.decoded.amount0Out);

                this.ranking.set(transaction.meta.txOrigin, pointsPerAddress[transaction.meta.txOrigin]);
            }

            if (result.length === limit) { offset += limit; }
            else { end = true; }
        }

        // sort by the highest points and store it
        this.ranking = new Map([...this.ranking.entries()].sort(
            (a: [string, BigNumber], b: [string, BigNumber]): number =>
            {
                const pointsA: BigNumber = a[1];
                const pointsB: BigNumber = b[1];

                if (pointsA.gte(pointsB)) return -1;
                if (pointsA.lte(pointsB)) return 1;
                return 0;
            },
        ));
    }

    public getTradingCompetitionRanking(): IRankingItem[]
    {
        const pairInfo: IPair | undefined = this.getPair(
            <string> this.configService.get<string>("tradingCompetition.pairAddress"),
        );

        if (!pairInfo) return [];

        return [...this.ranking.entries()].map((rankingItem: [string, BigNumber]) =>
        {
            return {
                address: rankingItem[0],
                points: formatEther(parseUnits(rankingItem[1].toString(), 18 - pairInfo.token0.decimals)),
            };
        }) as IRankingItem[];
    }
}
