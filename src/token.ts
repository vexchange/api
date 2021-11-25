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
  readonly usdPrice: BigNumber;
  readonly decimals: number;
}

export class Tokens {
  [key: string]: Token;
}
