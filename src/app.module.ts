import { PairsController } from "@controllers/pairs.controller";
import { TokenController } from "@controllers/token.controller";
import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ScheduleModule } from "@nestjs/schedule";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { CoinGeckoService } from "@services/coin-gecko.service";
import { OnchainDataService } from "@services/onchain-data.service";

@Module({
    imports: [
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
