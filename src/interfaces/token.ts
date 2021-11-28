export interface IToken {
  name: string;
  symbol: string;
  contractAddress: string;
  usdPrice: number | undefined;
  decimals: number;
}

export interface ITokens {
  [key: string]: IToken;
}
