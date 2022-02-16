import { BigNumber } from "ethers";

export interface IRankingItem {
  address: string;
  points: string;
}

export interface IAddressPoints {
  [address: string]: BigNumber;
}
