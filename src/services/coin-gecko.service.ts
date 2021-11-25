import { Injectable, OnModuleInit } from '@nestjs/common';
// import CoinGecko from 'coingecko-api';
// Somehow could not resolve with import, no matter what I do
const CoinGecko = require('coingecko-api');

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
