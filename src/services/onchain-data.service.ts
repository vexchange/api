import { forwardRef, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Framework } from '@vechain/connex-framework';
import { Driver, SimpleNet } from '@vechain/connex-driver';
import { find } from 'lodash';
import { VexchangeV2FactoryABI } from '@abi/VexchangeV2Factory';
import { VexchangeV2PairABI } from '@abi/VexchangeV2Pair';
import { IERC20ABI } from '@abi/IERC20';
import { FACTORY_ADDRESS } from 'vexchange-sdk';
import { ethers } from 'ethers';
import { formatEther, parseUnits } from 'ethers/lib/utils';
import { CoinGeckoService } from '@services/coin-gecko.service';
import { Interval } from '@nestjs/schedule';
import { IToken, ITokens } from '../interfaces/token';
import { IPair, IPairs } from '../interfaces/pair';
import { times } from 'lodash';

@Injectable()
export class OnchainDataService implements OnModuleInit {
  private pairs: IPairs = {};
  private tokens: ITokens = {};
  private connex: Connex;
  private factoryContract: Connex.Thor.Account.Visitor;
  private readonly logger = new Logger(OnchainDataService.name);

  constructor(
    @Inject(forwardRef(() => CoinGeckoService))
    private readonly coingeckoService: CoinGeckoService,
  ) {}

  async onModuleInit(): Promise<void> {
    const net = new SimpleNet('https://mainnet.veblocks.net');
    const driver = await Driver.connect(net);
    this.connex = new Framework(driver);
    this.factoryContract = this.connex.thor.account(FACTORY_ADDRESS);
    this.logger.log('Fetching on chain data...')
    await this.fetch();
    this.logger.log('Fetching on chain data completed')
  }

  @Interval(60000)
  async fetch(): Promise<void> {
    return new Promise(async (resolve) => {
      const allPairsLengthABI = find(VexchangeV2FactoryABI, {
        name: 'allPairsLength',
      });
      let method = this.factoryContract.method(allPairsLengthABI);
      const numPairs = parseInt((await method.call()).decoded[0]);
      const allPairs = find(VexchangeV2FactoryABI, { name: 'allPairs' });
      const token0ABI = find(VexchangeV2PairABI, { name: 'token0' });
      const token1ABI = find(VexchangeV2PairABI, { name: 'token1' });
      const getReservesABI = find(VexchangeV2PairABI, { name: 'getReserves' });
      const swapEventABI = find(VexchangeV2PairABI, { name: 'Swap' });
      method = this.factoryContract.method(allPairs);

      times(numPairs, async (i) => {
        const res = await method.call(i);
        const pairAddress = res.decoded[0];
        const pairContract = this.connex.thor.account(pairAddress);

        const token0Address = (await pairContract.method(token0ABI).call())
          .decoded[0];

        const token1Address = (await pairContract.method(token1ABI).call())
          .decoded[0];

        const token0: IToken = await this.fetchToken(token0Address);
        const token1: IToken = await this.fetchToken(token1Address);

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

        this.pairs[pairAddress] = {
          address: pairAddress,
          token0,
          token1,
          price: formatEther(price),
          token0Reserve: formatEther(reserve0),
          token1Reserve: formatEther(reserve1),
          token0Volume: formatEther(accToken0Volume),
          token1Volume: formatEther(accToken1Volume),
        };

        resolve();
      });
    });
  }

  async fetchToken(address: string): Promise<IToken> {
    const nameABI = find(IERC20ABI, { name: 'name' });
    const symbolABI = find(IERC20ABI, { name: 'symbol' });
    const decimalsABI = find(IERC20ABI, { name: 'decimals' });

    const symbol = (
      await this.connex.thor.account(address).method(symbolABI).call()
    ).decoded[0];

    let price = null;
    if (symbol === 'WVET') price = this.coingeckoService.getVetPrice();

    if (address in this.tokens) {
      const token = {
        ...this.tokens[address],
        usdPrice: price,
      };

      this.tokens[address] = token;

      return token;
    }

    const name = (
      await this.connex.thor.account(address).method(nameABI).call()
    ).decoded[0];

    const decimals = (
      await this.connex.thor.account(address).method(decimalsABI).call()
    ).decoded[0];

    let usdPrice = null;
    if (symbol === 'WVET') usdPrice = this.coingeckoService.getVetPrice();

    const token: IToken = {
      name,
      symbol,
      contractAddress: address,
      usdPrice,
      decimals: parseInt(decimals),
    };

    this.tokens[address] = token;

    return token;
  }

  getAllPairs(): IPairs {
    return this.pairs;
  }

  getPair(pairAddress: string): IPair {
    return this.pairs[pairAddress];
  }

  getAllTokens(): ITokens {
    return this.tokens;
  }

  getToken(tokenAddress: string): IToken {
    return this.tokens[tokenAddress];
  }
}
