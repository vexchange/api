import { Token } from "@src/token";
import { BigNumber } from "ethers";

export class Pair {
  constructor(
    aAddress: string,
    aToken0: Token,
    aToken1: Token,
    aPrice: string,
    aToken0Reserve: BigNumber,
    aToken1Reserve: BigNumber,
    aToken0Vol: string,
    aToken1Vol: string,
  ) {
    this.address = aAddress;
    this.token0 = aToken0;
    this.token1 = aToken1;
    this.price = aPrice;
    this.token0Reserve = aToken0Reserve;
    this.token1Reserve = aToken1Reserve;
    this.token0Volume = aToken0Vol;
    this.token1Volume = aToken1Vol;
  }

  readonly address: string;
  readonly token0: Token;
  readonly token1: Token;
  readonly price: string;
  readonly token0Reserve: BigNumber;
  readonly token1Reserve: BigNumber;
  readonly token0Volume: string;
  readonly token1Volume: string;
}

export class Pairs {
  [key: string]: Pair;
}
