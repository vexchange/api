import { Injectable, OnModuleInit } from "@nestjs/common";
import { Pair } from "../pair";
import { Framework } from "@vechain/connex-framework";
import { Driver, SimpleNet } from "@vechain/connex-driver";
import { find } from "lodash";
import { VexchangeV2FactoryABI } from "../../abi/VexchangeV2Factory";
import { VexchangeV2PairABI } from "../../abi/VexchangeV2Pair";
import { IERC20ABI } from "../../abi/IERC20";
import { Pairs } from "../pairs";
import { ChainId, FACTORY_ADDRESS, Fetcher } from "vexchange-sdk";
import { Tokens } from "@src/tokens";
import { Token } from "@src/token";
import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils";

@Injectable()
export class OnchainDataService implements OnModuleInit {
  private pairs: Pairs = {};
  private tokens: Tokens = {};
  private connex: Connex;
  private factoryContract: Connex.Thor.Account.Visitor;

  async onModuleInit(): Promise<void> {
    const net = new SimpleNet('https://mainnet.veblocks.net');
    const driver = await Driver.connect(net);
    this.connex = new Framework(driver);

    this.factoryContract = this.connex.thor.account(FACTORY_ADDRESS);

    this.fetch();
  }

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

      // TODO: Validate if this math works for coins that don't have 18dp
      const price = BigNumber.from(reserve1)
        .mul('1000000000000000000') // For precision for BigNumber arithmetic
        .div(reserve0);

      this.pairs[pairAddress] = new Pair(
        pairAddress,
        token0,
        token1,
        formatEther(price),
        BigNumber.from(reserve0),
        BigNumber.from(reserve1),
      );
    }
  }

  async fetchToken(address: string): Promise<Token> {
    if (address in this.tokens) {
      return this.tokens[address];
    }
    else {
      const nameABI = find(IERC20ABI, { name: 'name' });
      const symbolABI = find(IERC20ABI, { name: 'symbol' });

      const name = (
        await this.connex.thor.account(address).method(nameABI).call()
      ).decoded[0];

      const symbol = (
        await this.connex.thor.account(address).method(symbolABI).call()
      ).decoded[0];

      const token = new Token(name, symbol, address, 0);

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
