import { TokenVolume } from "@src/token-volume";
import { Token } from "@src/token";

export class Pair {
  constructor(
    aAddress: string,
    aToken0: Token,
    aToken1: Token,
    aPrice: number,
  ) {
    this.address = aAddress;
    this.token0 = aToken0;
    this.token1 = aToken1;
    this.price = aPrice;
  }

  readonly address: string;
  readonly token0: Token;
  readonly token1: Token;
  readonly price: number;
  readonly token0Reserve: TokenVolume;
  readonly token1Reserve: TokenVolume;
}
