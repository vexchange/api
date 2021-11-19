import { BadRequestException, Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { Pair } from '../pair';
import { PairsService } from './pairs.service';
import { isAddress } from "ethers/lib/utils";
import { Pairs } from "../pairs";

@Controller({ path: 'pairs', version: '1' })
export class PairsController {
  constructor(private readonly pairsService: PairsService) {}

  @Get()
  getPairs(): Pairs {
    return this.pairsService.getAll();
  }

  @Get(':query')
  getFromPairAddress(@Param() params): Pair {
    if (isAddress(params.query)) {
      const pair = this.pairsService.getPair(params.query);

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