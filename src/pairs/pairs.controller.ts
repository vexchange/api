import { Controller, Get, HttpStatus, Param, Res } from "@nestjs/common";
import { Pair } from '../pair';
import { PairsService } from './pairs.service';
import { isAddress } from "ethers/lib/utils";
import { Pairs } from "../pairs";
import { Response } from 'express';

@Controller({ path: 'pairs', version: '1' })
export class PairsController {
  constructor(private readonly pairsService: PairsService) {
    pairsService.initialize();
  }

  @Get()
  getPairs(): Pairs {
    return this.pairsService.getAll();
  }

  @Get(':query')
  getFromPairAddress(@Param() params): Pair {
    if (isAddress(params.query)) {
      return this.pairsService.getPair(params.query);
    }
    // TODO: To support symbols and token addresses
    // else if (params.query.contains()) {}
    else {
      // Return HTTP 400
      throw HttpStatus.BAD_REQUEST;
    }
  }
}
