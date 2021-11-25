import { BadRequestException, Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { OnchainDataService } from "@services/onchain-data.service";
import { isAddress } from "ethers/lib/utils";
import { GetPairFromAddressDto } from "../dto/get-pair-from-address.dto";
import { Pair, Pairs } from "../pair";

@Controller({ path: "pairs", version: "1" })
@ApiTags("pairs")
export class PairsController
{
    public constructor(private readonly onchainDataService: OnchainDataService) {}

    @Get()
    public getPairs(): Pairs
    {
        return this.onchainDataService.getAllPairs();
    }

    @Get(":address")
    public getPairFromAddress(@Param() params: GetPairFromAddressDto): Pair
    {
        if (params.address === undefined || !isAddress(params.address))
        {
            throw new BadRequestException("Invalid request");
        }

        const pair: Pair | undefined = this.onchainDataService.getPair(params.address);
        if (pair !== undefined) return pair;

        throw new NotFoundException("Pair does not exist");
    }
}
