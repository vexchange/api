import { Module } from '@nestjs/common';
import { TokenController } from '@controllers/token.controller';
import { PairsController } from '@controllers/pairs.controller';
import { OnchainDataService } from '@services/onchain-data.service';
import { CoinGeckoService } from '@services/coin-gecko.service';
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";

@Module({
  imports: [
    ThrottlerModule.forRoot({
      // This means that the user can only make
      // 10 queries per 60 seconds
      // i.e. 1 query per 6 seconds
      ttl: 60,
      limit: 10,
    }),
  ],
  controllers: [PairsController, TokenController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    OnchainDataService,
    CoinGeckoService,
  ],
  exports: [],
})
export class AppModule {}
