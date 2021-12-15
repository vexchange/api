import { MedianTraderController } from "@controllers/medianTrade.controller";
import { PairController } from "@controllers/pair.controller";
import { TokenController } from "@controllers/token.controller";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { CoinGeckoService } from "@services/coin-gecko.service";
import { OnchainDataService } from "@services/onchain-data.service";

@Module({
    imports: [
        ConfigModule.forRoot(),
        // For scheduling recurring tasks
        ScheduleModule.forRoot(),
    ],
    controllers: [PairController, TokenController, MedianTraderController],
    providers: [
        OnchainDataService,
        CoinGeckoService,
    ],
    exports: [],
})
export class AppModule {}
