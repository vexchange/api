import { IPair, IPairs } from "@interfaces/pair";
import { BadRequestException, Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { OnchainDataService } from "@services/onchain-data.service";
import { isAddress } from "ethers/lib/utils";

@Controller({ path: "pairs", version: "1" })
@ApiTags("pairs")
export class PairController
{
    public constructor(private readonly onchainDataService: OnchainDataService) {}

    @Get()
    public getPairs(): IPairs
    {
        return this.onchainDataService.getAllPairs();
    }

    @Get(":address")
    public getPairFromAddress(@Param("address") address: string): IPair
    {
        if (!isAddress(address))
        {
            throw new BadRequestException("Invalid request");
        }

        const pair: IPair | undefined = this.onchainDataService.getPair(address);
        if (pair !== undefined) return pair;

        throw new NotFoundException("Pair does not exist");
    }
}
