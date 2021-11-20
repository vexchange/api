import { Controller, Get, Param } from "@nestjs/common";
import { Token } from "../token";
import { isAddress } from "ethers/lib/utils";
import { OnchainDataService } from '@services/onchain-data.service';
import { Pairs } from "../pairs";

@Controller({ path: 'tokens', version: '1' })
export class TokenController {
  constructor(private readonly pairsService: OnchainDataService) {}

  @Get()
  getTokens(): Pairs {
    return this.pairsService.getAll();
  }
  //
  // @Get(':query')
  // getFromTokenAddress(@Param() params): Token {
  //   if (isAddress(params.query)) {
  //     const token =
  //   }
  // }
}
