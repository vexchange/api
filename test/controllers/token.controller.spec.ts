import { TokenController } from "@controllers/token.controller";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { CoinGeckoService } from "@services/coin-gecko.service";
import { OnchainDataService } from "@services/onchain-data.service";
import { allTokens, token } from "../mocks/token";

describe("TokenController", () =>
{
    let tokenController: TokenController;
    let onchainDataService: OnchainDataService;

    beforeEach(async() =>
    {
        const moduleRef: TestingModule = await Test.createTestingModule({
            controllers: [TokenController],
            providers: [CoinGeckoService, OnchainDataService],
        }).compile();

        onchainDataService = moduleRef.get<OnchainDataService>(OnchainDataService);
        tokenController = moduleRef.get<TokenController>(TokenController);
    });

    describe("getTokens", () =>
    {
        it("should return all tokens", async() =>
        {
            // arrange
            jest
                .spyOn(onchainDataService, "getAllTokens")
                .mockImplementation(() => allTokens);

            // act & assert
            expect(tokenController.getTokens()).toBe(allTokens);
        });
    });

    describe("getTokenFromAddress", () =>
    {
        it("should return token", async() =>
        {
            // arrange
            const address: string = "0x2b6fc877ff5535b50f6c3e068bb436b16ec76fc5";
            jest
                .spyOn(onchainDataService, "getToken")
                .mockImplementation(() => token);

            // act & assert
            expect(tokenController.getTokenFromAddress(address)).toBe(token);
        });

        it("should throw exception - Token does not exist", async() =>
        {
            // arrange
            const address: string = "0x2b6fc877ff5535b50f6c3e068bb436b16ec76fc5";
            jest.spyOn(onchainDataService, "getToken").mockImplementation(() => undefined);

            try
            {
                // act
                tokenController.getTokenFromAddress(address);
            }
            catch (error)
            {
                // assert
                expect(error).toStrictEqual(
                    new NotFoundException("Token does not exist"),
                );
            }
        });

        it("should throw exception - Invalid request", async() =>
        {
            // arrange
            const address: string = "";
            jest.spyOn(onchainDataService, "getToken").mockImplementation(() => undefined);

            try
            {
                // act
                tokenController.getTokenFromAddress(address);
            }
            catch (error)
            {
                // assert
                expect(error).toStrictEqual(new BadRequestException("Invalid request"));
            }
        });
    });
});
