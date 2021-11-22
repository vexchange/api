import { Module } from '@nestjs/common';
import { TokenController } from '@controllers/token.controller';
import { PairsController } from '@controllers/pairs.controller';
import { OnchainDataService } from '@services/onchain-data.service';
import { CoinGeckoService } from '@services/coin-gecko.service';

@Module({
  imports: [],
  controllers: [PairsController, TokenController],
  providers: [OnchainDataService, CoinGeckoService],
  exports: [],
})
export class AppModule {}
