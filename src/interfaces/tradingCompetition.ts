import { BigNumber } from "ethers";

export interface IRankingRow {
  points: BigNumber;
}

export interface IRanking {
  [address: string]: IRankingRow;
}
