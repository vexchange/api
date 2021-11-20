import { BigNumber } from "ethers";

export class Token {
  constructor(
    aName,
    aSymbol,
    aContractAddress,
    aDecimals,
    aUsdPrice,
    aCirculatingSupply,
    aTotalSupply,
  ) {
    this.name = aName;
    this.symbol = aSymbol;
    this.contractAddress = aContractAddress;
    this.decimals = aDecimals;
    this.usdPrice = aUsdPrice;
    this.circulatingSupply = aCirculatingSupply;
    this.totalSupply = aTotalSupply;
  }

  readonly name: string;
  readonly symbol: string;
  readonly contractAddress: string;
  readonly decimals: number;
  readonly usdPrice: BigNumber;
  readonly circulatingSupply: BigNumber;
  readonly totalSupply: BigNumber;
}
