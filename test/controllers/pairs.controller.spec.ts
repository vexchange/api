import { PairsController } from "@controllers/pairs.controller";
import { Test, TestingModule } from "@nestjs/testing";
import { CoinGeckoService } from "@services/coin-gecko.service";
import { OnchainDataService } from "@services/onchain-data.service";
import { allPairs } from "../mocks/pairs";

describe("PairsController", () =>
{
    let pairsController: PairsController;
    let onchainDataService: OnchainDataService;

    beforeEach(async() =>
    {
        const moduleRef: TestingModule = await Test.createTestingModule({
            controllers: [PairsController],
            providers: [CoinGeckoService, OnchainDataService],
        }).compile();

        onchainDataService = moduleRef.get<OnchainDataService>(OnchainDataService);
        pairsController = moduleRef.get<PairsController>(PairsController);
    });

    describe("getPairs", () =>
    {
        it("should return all pairs", async() =>
        {
            jest
                .spyOn(onchainDataService, "getAllPairs")
                .mockImplementation(() => allPairs);

            expect(pairsController.getPairs()).toBe(allPairs);
        });
    });
});
