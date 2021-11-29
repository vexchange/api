import {
  Controller,
  Get,
  BadRequestException,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { OnchainDataService } from '@services/onchain-data.service';
import { isAddress } from 'ethers/lib/utils';
import { ApiTags } from '@nestjs/swagger';
import { IPair, IPairs } from '../interfaces/pair';

@Controller({ path: 'pairs', version: '1' })
@ApiTags('pairs')
export class PairController {
  constructor(private readonly onchainDataService: OnchainDataService) {}

  @Get()
  getPairs(): IPairs {
    return this.onchainDataService.getAllPairs();
  }

  @Get(':address')
  getPairFromAddress(@Param('address') address: string): IPair {
    if (!isAddress(address)) {
      throw new BadRequestException('Invalid request');
    }

    const pair = this.onchainDataService.getPair(address);
    if (pair) return pair;

    throw new NotFoundException('Pair does not exist');
  }
}
