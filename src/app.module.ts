import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PairsController } from './pairs/pairs.controller';
import { OnchainDataService } from './onchain-data-service/onchain-data.service';
import { TokenController } from './token/token.controller';
import { CoinGeckoService } from './coin-gecko-service/coin-gecko.service';

@Module({
  imports: [],
  controllers: [AppController, PairsController, TokenController],
  providers: [AppService, OnchainDataService, CoinGeckoService],
})
export class AppModule {}
