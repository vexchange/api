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
    public getTradingCompetitionRanking()
    {
        return this.onchainDataService.getTradingCompetitionRanking();
    }
}
