import { Module } from '@nestjs/common';
import { TokenController } from './token/token.controller';
import { PairsController } from './pairs/pairs.controller';
import { OnchainDataService } from '@services/onchain-data.service';
import { CoinGeckoService } from '@services/coin-gecko.service';

@Module({
  imports: [],
  controllers: [PairsController, TokenController],
  providers: [OnchainDataService, CoinGeckoService],
})
export class AppModule {}
