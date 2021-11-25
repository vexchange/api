import { Injectable, OnModuleInit } from '@nestjs/common';
import * as CoinGecko from 'coingecko-api';

@Injectable()
export class CoinGeckoService implements OnModuleInit {
  private client;
  private vetPrice;

  onModuleInit(): void {
    this.client = new CoinGecko();
    this.fetch();
  }

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
