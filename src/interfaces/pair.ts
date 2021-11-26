import { IToken } from "./token";

export interface IPair {
  address: string;
  token0: IToken;
  token1: IToken;
  price: string;
  token0Reserve: string;
  token1Reserve: string;
  token0Volume: string;
  token1Volume: string;
}

export interface IPairs {
  [key: string]: IPair;
}
