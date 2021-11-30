import { IToken, ITokens } from "@interfaces/token";
import { BadRequestException, Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { OnchainDataService } from "@services/onchain-data.service";
import { isAddress } from "ethers/lib/utils";

@Controller({ path: "tokens", version: "1" })
@ApiTags("tokens")
export class TokenController
{
    public constructor(private readonly onchainDataService: OnchainDataService) {}

    @Get()
    public getTokens(): ITokens
    {
        return this.onchainDataService.getAllTokens();
    }


    @Get(":address")
    public getTokenFromAddress(@Param("address") address: string): IToken
    {
        if (!isAddress(address))
        {
            throw new BadRequestException("Invalid request");
        }

        const token: IToken | undefined = this.onchainDataService.getToken(address);
        if (token !== undefined) return token;

        throw new NotFoundException("Token does not exist");
    }
}
