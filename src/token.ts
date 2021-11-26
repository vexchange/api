import { BigNumber } from "ethers";

export class Token {
  constructor(
    aName,
    aSymbol,
    aContractAddress,
    aUsdPrice,
    aDecimals,
  ) {
    this.name = aName;
    this.symbol = aSymbol;
    this.contractAddress = aContractAddress;
    this.usdPrice = aUsdPrice;
    this.decimals = aDecimals;
  }

  readonly name: string;
  readonly symbol: string;
  readonly contractAddress: string;
  private usdPrice: number;
  readonly decimals: number;

  public getUsdPrice(): number {
    return this.usdPrice;
  }

  public setUsdPrice(aNewUsdPrice: number): void {
    this.usdPrice = aNewUsdPrice;
  }
}

export class Tokens {
  [key: string]: Token;
}
