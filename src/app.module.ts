import { HealthController } from "@controllers/health.controller";
import { PairController } from "@controllers/pair.controller";
import { TokenController } from "@controllers/token.controller";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { CoinGeckoService } from "@services/coin-gecko.service";
import { OnchainDataService } from "@services/onchain-data.service";
import { TradingCompetitionController } from "@controllers/trading-competition.controller";

@Module({
    imports: [
        ConfigModule.forRoot(),
        // For scheduling recurring tasks
        ScheduleModule.forRoot(),
    ],
    controllers: [PairController, TokenController, TradingCompetitionController, HealthController],
    providers: [
        OnchainDataService,
        CoinGeckoService,
    ],
    exports: [],
})
export class AppModule {}
