import {
  Controller,
  Get,
  BadRequestException,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { Pair, Pairs } from '../pair';
import { OnchainDataService } from '@services/onchain-data.service';
import { isAddress } from 'ethers/lib/utils';
import { ApiTags } from '@nestjs/swagger';
import { GetPairFromAddressDto } from '../dto/get-pair-from-address.dto';

@Controller({ path: 'pairs', version: '1' })
@ApiTags('pairs')
export class PairsController {
  constructor(private readonly onchainDataService: OnchainDataService) {}

  @Get()
  getPairs(): Pairs {
    return this.onchainDataService.getAllPairs();
  }

  @Get(':address')
  getPairFromAddress(@Param() params: GetPairFromAddressDto): Pair {
    if (!isAddress(params.address)) {
      throw new BadRequestException('Invalid request');
    }

    const pair = this.onchainDataService.getPair(params.address);
    if (pair) return pair;

    throw new NotFoundException('Pair does not exist');
  }
}
