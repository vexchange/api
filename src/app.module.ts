import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TokenController } from './token/token.controller';
import { PairsController } from './pairs/pairs.controller';
import { OnchainDataService } from '@services/onchain-data.service';
import { CoinGeckoService } from '@services/coin-gecko.service';

@Module({
  imports: [],
  controllers: [AppController, PairsController, TokenController],
  providers: [AppService, OnchainDataService, CoinGeckoService],
})
export class AppModule {}
