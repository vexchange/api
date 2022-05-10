import { PairController } from "@controllers/pair.controller";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { CoinGeckoService } from "@services/coin-gecko.service";
import { OnchainDataService } from "@services/onchain-data.service";
import { allPairs, pair } from "../mocks/pair";

describe("PairController", () =>
{
    let pairController: PairController;
    let onchainDataService: OnchainDataService;

    beforeEach(async() =>
    {
        const moduleRef: TestingModule = await Test.createTestingModule({
            controllers: [PairController],
            providers: [CoinGeckoService, OnchainDataService, ConfigService],
        }).compile();

        onchainDataService = moduleRef.get<OnchainDataService>(OnchainDataService);
        pairController = moduleRef.get<PairController>(PairController);
    });

    describe("getPairs", () =>
    {
        it("should return all pairs", async() =>
        {
            // arrange
            jest
                .spyOn(onchainDataService, "getAllPairs")
                .mockImplementation(() => allPairs);

            // act & assert
            expect(pairController.getPairs()).toBe(allPairs);
        });
    });

    describe("getPairFromAddress", () =>
    {
        it("should return pair", async() =>
        {
            // arrange
            const address: string = "0x2b6fc877ff5535b50f6c3e068bb436b16ec76fc5";
            jest.spyOn(onchainDataService, "getPair").mockImplementation(() => pair);

            // act & assert
            expect(pairController.getPairFromAddress(address)).toBe(pair);
        });

        it("should throw exception - Pair does not exist", async() =>
        {
            // arrange
            const address: string = "0x2b6fc877ff5535b50f6c3e068bb436b16ec76fc5";
            jest.spyOn(onchainDataService, "getPair").mockImplementation(() => undefined);

            try
            {
                // act
                pairController.getPairFromAddress(address);
            }
            catch (error)
            {
                // assert
                expect(error).toStrictEqual(
                    new NotFoundException("Pair does not exist"),
                );
            }
        });

        it("should throw exception - Invalid request", async() =>
        {
            // arrange
            const address: string = "";
            jest.spyOn(onchainDataService, "getPair").mockImplementation(() => undefined);

            try
            {
                // act
                pairController.getPairFromAddress(address);
            }
            catch (error)
            {
                // assert
                expect(error).toStrictEqual(new BadRequestException("Invalid request"));
            }
        });
    });
});
