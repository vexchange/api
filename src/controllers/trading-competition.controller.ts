import { IPairs } from "@interfaces/pair";
import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { OnchainDataService } from "@services/onchain-data.service";

@Controller({ path: "trading-competition", version: "1" })
@ApiTags("trading-competition")
export class TradingCompetitionController
{
    public constructor(private readonly onchainDataService: OnchainDataService) {}

    @Get()
    public getRanking()
    {
        // TODO: check the need of receiving the pairAddress and period via
        const pairAddress = '0x717829915367308FF113394eB84B174993e19b07'
        return this.onchainDataService.getTradingVolumePerPair(pairAddress);
    }
}
