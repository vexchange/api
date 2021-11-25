import { Token } from '@src/token';
import { BigNumber } from 'ethers';

export class Pair {
  constructor(
    aAddress: string,
    aToken0: Token,
    aToken1: Token,
    aPrice: string,
    aToken0Reserve: BigNumber,
    aToken1Reserve: BigNumber,
    aToken0Vol: string,
    aToken1Vol: string,
  ) {
    this.address = aAddress;
    this.token0 = aToken0;
    this.token1 = aToken1;
    this.price = aPrice;
    this.token0Reserve = aToken0Reserve;
    this.token1Reserve = aToken1Reserve;
    this.token0Volume = aToken0Vol;
    this.token1Volume = aToken1Vol;
  }

  readonly address: string;
  readonly token0: Token;
  readonly token1: Token;
  private price: string;
  private token0Reserve: BigNumber;
  private token1Reserve: BigNumber;
  private token0Volume: string;
  private token1Volume: string;

  public getPrice(): string {
    return this.price;
  }

  public setPrice(aNewPrice: string): void {
    this.price = aNewPrice;
  }

  public getToken0Reserve(): BigNumber {
    return this.token0Reserve;
  }
  public setToken0Reserve(aNewToken0Reserve: BigNumber): void {
    this.token0Reserve = aNewToken0Reserve;
  }
  public getToken1Reserve(): BigNumber {
    return this.token1Reserve;
  }
  public setToken1Reserve(aNewToken1Reserve: BigNumber): void {
    this.token1Reserve = aNewToken1Reserve;
  }

  public getToken0Volume(): string {
    return this.token0Volume;
  }

  public setToken0Volume(aNewToken0Volume): void {
    this.token0Volume = aNewToken0Volume;
  }

  public getToken1Volume(): string {
    return this.token1Volume;
  }
  public setToken1Volume(aNewToken1Volume): void {
    this.token1Volume = aNewToken1Volume;
  }
}

export class Pairs {
  [key: string]: Pair;
}
