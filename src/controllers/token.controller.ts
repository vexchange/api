import { BadRequestException, Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { Token } from "../token";
import { isAddress } from "ethers/lib/utils";
import { OnchainDataService } from '@services/onchain-data.service';
import { Tokens } from "@src/tokens";

@Controller({ path: 'tokens', version: '1' })
export class TokenController {
  constructor(private readonly onchainDataService: OnchainDataService) {}

  @Get()
  getTokens(): Tokens {
    return this.onchainDataService.getAllTokens();
  }

  @Get(':query')
  getFromTokenAddress(@Param() params): Token {
    if (isAddress(params.query)) {
      const token = this.onchainDataService.getToken(params.query);
      if (token) return token;
      else throw new NotFoundException('Token does not exist');
    }
    else {
      // Return HTTP 400
      throw new BadRequestException('Invalid request');
    }
  }
}
