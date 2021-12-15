import { IToken } from "@interfaces/token";

export interface IMedianTrade {
  token0: IToken;
  token1: IToken;
  token0MedianSize: string;
  token1MedianSize: string;
}

export interface IMedianTrades {
  [key: string]: IMedianTrade;
}
