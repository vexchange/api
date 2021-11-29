import { Module } from '@nestjs/common';
import { TokenController } from '@controllers/token.controller';
import { PairController } from '@controllers/pair.controller';
import { OnchainDataService } from '@services/onchain-data.service';
import { CoinGeckoService } from '@services/coin-gecko.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
@Module({
  imports: [
    ConfigModule.forRoot(),
    // For rate limiting
    ThrottlerModule.forRoot({
      // This means that the user can only make
      // 10 queries per 60 seconds
      // i.e. 1 query per 6 seconds
      ttl: 60,
      limit: 10,
    }),
    // For scheduling recurring tasks
    ScheduleModule.forRoot(),
  ],
  controllers: [PairController, TokenController],
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
