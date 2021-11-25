import { BadRequestException, Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { OnchainDataService } from "@services/onchain-data.service";
import { isAddress } from "ethers/lib/utils";
import { GetTokenFromAddressDto } from "../dto/get-token-from-address.dto";
import { Token, Tokens } from "../token";

@Controller({ path: "tokens", version: "1" })
@ApiTags("tokens")
export class TokenController
{
    public constructor(private readonly onchainDataService: OnchainDataService) {}

    @Get()
    public getTokens(): Tokens
    {
        return this.onchainDataService.getAllTokens();
    }

    @Get(":address")
    public getTokenFromAddress(@Param() params: GetTokenFromAddressDto): Token
    {
        if (!isAddress(params.address))
        {
            throw new BadRequestException("Invalid request");
        }

        const token: Token | undefined = this.onchainDataService.getToken(params.address);
        if (token !== undefined) return token;

        throw new NotFoundException("Token does not exist");
    }
}
