import { IPair, IPairs } from "@interfaces/pair";
import { BadRequestException, Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { OnchainDataService } from "@services/onchain-data.service";
import { isAddress } from "ethers/lib/utils";
import { GetPairFromAddressDto } from "../dto/get-pair-from-address.dto";

@Controller({ path: "pairs", version: "1" })
@ApiTags("pairs")
export class PairsController
{
    public constructor(private readonly onchainDataService: OnchainDataService) {}

    @Get()
    public getPairs(): IPairs
    {
        return this.onchainDataService.getAllPairs();
    }

    @Get(":address")
    public getPairFromAddress(@Param('address') address: string): IPair
    {
        if (params.address === undefined || !isAddress(address))
        {
            throw new BadRequestException("Invalid request");
        }

        const pair: IPair | undefined = this.onchainDataService.getPair(address);
        if (pair !== undefined) return pair;

        throw new NotFoundException("Pair does not exist");
    }
}
