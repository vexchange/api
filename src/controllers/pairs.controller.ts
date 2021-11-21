import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { Pair } from '../pair';
import { OnchainDataService } from '@services/onchain-data.service';
import { isAddress } from "ethers/lib/utils";
import { Pairs } from "../pairs";

@Controller({ path: 'pairs', version: '1' })
export class PairsController {
  constructor(private readonly onchainDataService: OnchainDataService) {}

  @Get()
  getPairs(): Pairs {
    return this.onchainDataService.getAllPairs();
  }

  @Get(':query')
  getFromPairAddress(@Param() params): Pair {
    if (isAddress(params.query)) {
      const pair = this.onchainDataService.getPair(params.query);

      if (pair) return pair;
      else throw new NotFoundException('Pair does not exist');
    }
    // TODO: To support symbols and token addresses
    // else if (params.query.contains()) {}
    else {
      // Return HTTP 400
      throw new BadRequestException('Invalid request');
    }
  }
}
