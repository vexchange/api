import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { OnchainDataService } from "@services/onchain-data.service";
import { IRankingItem } from "../interfaces/trading-competition";

@Controller({ path: "trading-competition", version: "1" })
@ApiTags("trading-competition")
export class TradingCompetitionController
{
    public constructor(private readonly onchainDataService: OnchainDataService) {}

    @Get("ranking")
    public getRanking(): IRankingItem[]
    {
        return this.onchainDataService.getTradingCompetitionRanking();
    }
}
