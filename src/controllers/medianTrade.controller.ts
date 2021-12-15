import { IMedianTrade, IMedianTrades } from "@interfaces/medianTrade";
import { BadRequestException, Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { OnchainDataService } from "@services/onchain-data.service";
import { isAddress } from "ethers/lib/utils";


@Controller({ path: "median", version: "1" })
@ApiTags("median")
export class MedianTraderController
{
    public constructor(private readonly onchainDataService: OnchainDataService) {}

    @Get()
    public getMedianTrades(): IMedianTrades
    {
        return this.onchainDataService.getMedianTrades();
    }

    @Get(":address")
    public getMedianTradeFromPair(@Param("address") address: string): IMedianTrade
    {
        if (!isAddress(address))
        {
            throw new BadRequestException("Invalid request");
        }
        const pairTrade: IMedianTrade | undefined = this.onchainDataService.getMedianTrade(address);
        if (pairTrade !== undefined) return pairTrade;

        throw new NotFoundException("Pair does not exist");
    }
}
