import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { OnchainDataService } from "@services/onchain-data.service";
import { IRanking, IRankingItemFormatted } from "../interfaces/tradingCompetition";

@Controller({ path: "trading-competition", version: "1" })
@ApiTags("trading-competition")
export class TradingCompetitionController
{
    public constructor(private readonly onchainDataService: OnchainDataService) {}

    @Get()
    public getTradingCompetitionRanking(): IRankingItemFormatted[]
    {
        return this.onchainDataService.getTradingCompetitionRanking();
    }
}
