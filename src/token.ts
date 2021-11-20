import { BigNumber } from "ethers";

export class Token {
  constructor(
    aName,
    aSymbol,
    aContractAddress,
    aUsdPrice,
    // aDecimals,
    // aCirculatingSupply,
    // aTotalSupply,
  ) {
    this.name = aName;
    this.symbol = aSymbol;
    this.contractAddress = aContractAddress;
    this.usdPrice = aUsdPrice;
    // this.decimals = aDecimals;
    // this.circulatingSupply = aCirculatingSupply;
    // this.totalSupply = aTotalSupply;
  }

  readonly name: string;
  readonly symbol: string;
  readonly contractAddress: string;
  readonly usdPrice: BigNumber;
  // readonly decimals: number;
  // readonly circulatingSupply: BigNumber;
  // readonly totalSupply: BigNumber;
}
