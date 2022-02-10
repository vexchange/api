import { TradingCompetitionController } from "@controllers/trading-competition.controller";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { OnchainDataService } from "@services/onchain-data.service";
import { CoinGeckoService } from "../../src/services/coin-gecko.service";
import { fullRanking } from "../mocks/trading-competition";

describe("TradingCompetitionController", () =>
{
    let tradingCompetitionController: TradingCompetitionController;
    let onchainDataService: OnchainDataService;

    beforeEach(async() =>
    {
        const moduleRef: TestingModule = await Test.createTestingModule({
            controllers: [TradingCompetitionController],
            providers: [CoinGeckoService, OnchainDataService, ConfigService],
        }).compile();

        onchainDataService = moduleRef.get<OnchainDataService>(OnchainDataService);
        tradingCompetitionController = moduleRef.get<TradingCompetitionController>(TradingCompetitionController);
    });

    describe("getRanking", () =>
    {
        it("should return trading competition ranking", async() =>
        {
            // arrange
            jest
                .spyOn(onchainDataService, "getTradingCompetitionRanking")
                .mockImplementation(() => fullRanking);

            // act & assert
            expect(tradingCompetitionController.getRanking()).toBe(fullRanking);
        });
    });
});
