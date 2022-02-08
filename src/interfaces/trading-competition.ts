import { BigNumber } from "ethers";

export interface IRankingItem {
  rank: number;
  address: string;
  points: string | BigNumber;
}

export interface IAddressPoints {
  [address: string]: BigNumber;
}
