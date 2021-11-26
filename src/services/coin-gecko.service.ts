import { Injectable, OnModuleInit } from '@nestjs/common';
import * as CoinGecko from 'coingecko-api';
import { Interval } from '@nestjs/schedule';

@Injectable()
export class CoinGeckoService implements OnModuleInit {
  private client;
  private vetPrice;

  onModuleInit(): void {
    this.client = new CoinGecko();
    this.fetch();
  }

  @Interval(60000)
  async fetch(): Promise<void> {
    this.vetPrice = (
      await this.client.simple.price({
        ids: ['vechain'],
        vs_currencies: ['usd'],
      })
    ).data.vechain.usd;
  }

  getVetPrice() {
    return this.vetPrice;
  }
}
