import { BigNumber } from "@ethersproject/bignumber";

export interface IToken {
  name: string;
  symbol: string;
  contractAddress: string;
  usdPrice: number;
  decimals: number;
}

export interface ITokenReserve {
  type: string;
  hex: string | BigNumber;
}

export interface ITokens {
  [key: string]: IToken;
}
