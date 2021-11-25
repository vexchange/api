import { forwardRef, Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { Pair, Pairs } from "../pair";
import { Framework } from "@vechain/connex-framework";
import { Driver, SimpleNet } from "@vechain/connex-driver";
import { find } from "lodash";
import { VexchangeV2FactoryABI } from "@abi/VexchangeV2Factory";
import { VexchangeV2PairABI } from "@abi/VexchangeV2Pair";
import { IERC20ABI } from "@abi/IERC20";
import { FACTORY_ADDRESS } from "vexchange-sdk";
import { Token, Tokens } from "@src/token";
import { BigNumber, ethers } from "ethers";
import { formatEther, parseUnits } from "ethers/lib/utils";
import { CoinGeckoService } from "@services/coin-gecko.service";
import { Interval } from "@nestjs/schedule";

@Injectable()
export class OnchainDataService implements OnModuleInit {
  private pairs: Pairs = {};
  private tokens: Tokens = {};
  private connex: Connex;
  private factoryContract: Connex.Thor.Account.Visitor;

  constructor(
    @Inject(forwardRef(() => CoinGeckoService))
    private readonly coingeckoService: CoinGeckoService,
  ) {}

  async onModuleInit(): Promise<void> {
    const net = new SimpleNet('https://mainnet.veblocks.net');
    const driver = await Driver.connect(net);
    this.connex = new Framework(driver);

    this.factoryContract = this.connex.thor.account(FACTORY_ADDRESS);

    this.fetch();
  }

  @Interval(60000)
  async fetch(): Promise<void> {
    const allPairsLengthABI = find(VexchangeV2FactoryABI, {
      name: 'allPairsLength',
    });
    let method = this.factoryContract.method(allPairsLengthABI);
    const numPairs = parseInt((await method.call()).decoded[0]);

    const allPairs = find(VexchangeV2FactoryABI, { name: 'allPairs' });
    method = this.factoryContract.method(allPairs);

    const token0ABI = find(VexchangeV2PairABI, { name: 'token0' });
    const token1ABI = find(VexchangeV2PairABI, { name: 'token1' });
    const getReservesABI = find(VexchangeV2PairABI, { name: 'getReserves' });
    const swapEventABI = find(VexchangeV2PairABI, { name: 'Swap' });

    /**
     * TODO: Make parallel and asynchronous
     */
    for (let i = 0; i < numPairs; ++i) {
      const res = await method.call(i);
      const pairAddress = res.decoded[0];
      const pairContract = this.connex.thor.account(pairAddress);

      const token0Address = (await pairContract.method(token0ABI).call())
        .decoded[0];

      const token1Address = (await pairContract.method(token1ABI).call())
        .decoded[0];

      const token0: Token = await this.fetchToken(token0Address);
      const token1: Token = await this.fetchToken(token1Address);

      const { reserve0, reserve1 } = (
        await pairContract.method(getReservesABI).call()
      ).decoded;

      // Accounts for tokens with different decimal places
      const price = parseUnits(reserve0, 18 - token0.decimals)
        .mul(parseUnits('1')) // For added precision for BigNumber arithmetic
        .div(parseUnits(reserve1, 18 - token1.decimals));

      const swapEvent = pairContract.event(swapEventABI);

      const swapFilter = swapEvent.filter([]).range({
        unit: 'block',
        // Since every block is 10s, 8640 blocks will be 24h
        from: this.connex.thor.status.head.number - 8640,
        // Current block number
        to: this.connex.thor.status.head.number,
      });

      let end = false;
      let offset = 0;
      const limit = 256;

      let accToken0Volume = ethers.constants.Zero;
      let accToken1Volume = ethers.constants.Zero;

      // Need a while loop because we can only get
      // up to 256 events each round using connex
      while (!end) {
        const result = await swapFilter.apply(offset, limit);

        for (const transaction of result) {
          accToken0Volume = accToken0Volume
            .add(transaction.decoded.amount0In)
            .add(transaction.decoded.amount0Out);
          accToken1Volume = accToken1Volume
            .add(transaction.decoded.amount1In)
            .add(transaction.decoded.amount1Out);
        }

        if (result.length === limit) offset += limit;
        else end = true;
      }

      if (pairAddress in this.pairs) {
        this.pairs[pairAddress].setPrice(formatEther(price));
        this.pairs[pairAddress].setToken0Reserve(BigNumber.from(reserve0));
        this.pairs[pairAddress].setToken1Reserve(BigNumber.from(reserve1));
        this.pairs[pairAddress].setToken0Volume(formatEther(accToken0Volume));
        this.pairs[pairAddress].setToken1Volume(formatEther(accToken1Volume));
      }
      else {
        this.pairs[pairAddress] = new Pair(
          pairAddress,
          token0,
          token1,
          formatEther(price),
          BigNumber.from(reserve0),
          BigNumber.from(reserve1),
          formatEther(accToken0Volume),
          formatEther(accToken1Volume),
        );
      }
    }
  }

  async fetchToken(address: string): Promise<Token> {
    const nameABI = find(IERC20ABI, { name: 'name' });
    const symbolABI = find(IERC20ABI, { name: 'symbol' });
    const decimalsABI = find(IERC20ABI, { name: 'decimals' });

    const symbol = (
      await this.connex.thor.account(address).method(symbolABI).call()
    ).decoded[0];

    let price = null;
    if (symbol === 'WVET') price = this.coingeckoService.getVetPrice();

    if (address in this.tokens) {
      this.tokens[address].setUsdPrice(price);
      return this.tokens[address];
    } else {
      const nameABI = find(IERC20ABI, { name: 'name' });
      const symbolABI = find(IERC20ABI, { name: 'symbol' });
      const decimalsABI = find(IERC20ABI, { name: 'decimals' });

      const name = (
        await this.connex.thor.account(address).method(nameABI).call()
      ).decoded[0];

      const decimals = (
        await this.connex.thor.account(address).method(decimalsABI).call()
      ).decoded[0];

      let price = null;
      if (symbol === 'WVET') price = this.coingeckoService.getVetPrice();

      const token = new Token(name, symbol, address, price, parseInt(decimals));

      this.tokens[address] = token;
      return token;
    }
  }

  getAllPairs(): Pairs {
    return this.pairs;
  }

  getPair(pairAddress: string): Pair {
    return this.pairs[pairAddress];
  }

  getAllTokens(): Tokens {
    return this.tokens;
  }

  getToken(tokenAddress: string): Token {
    return this.tokens[tokenAddress];
  }
}
