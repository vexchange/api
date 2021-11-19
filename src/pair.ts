export class Pair {
  constructor(
    aAddress: string,
    aBaseToken: string,
    aQuoteToken: string,
    aPrice: number,
  ) {
    this.address = aAddress;
    this.baseToken = aBaseToken;
    this.quoteToken = aQuoteToken;
    this.price = aPrice;
  }

  readonly address: string;
  readonly baseToken: string;
  readonly quoteToken: string;
  readonly price: number;
}
