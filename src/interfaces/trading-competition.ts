import { BigNumber } from "ethers";

export interface IRankingItem {
  points: BigNumber;
}

export interface IRankingItemFormatted {
  rank: number;
  address: string;
  points: string | BigNumber;
}

export interface IRanking {
  [address: string]: IRankingItem;
}
