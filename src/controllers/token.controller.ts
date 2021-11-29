import {
  Controller,
  Get,
  BadRequestException,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { isAddress } from 'ethers/lib/utils';
import { OnchainDataService } from '@services/onchain-data.service';
import { ApiTags } from '@nestjs/swagger';
import { IToken, ITokens } from '../interfaces/token';

@Controller({ path: 'tokens', version: '1' })
@ApiTags('tokens')
export class TokenController {
  constructor(private readonly onchainDataService: OnchainDataService) {}

  @Get()
  getTokens(): ITokens {
    return this.onchainDataService.getAllTokens();
  }

  @Get(':address')
  getTokenFromAddress(@Param('address') address: string): IToken {
    if (!isAddress(address)) {
      throw new BadRequestException('Invalid request');
    }

    const token = this.onchainDataService.getToken(address);
    if (token) return token;

    throw new NotFoundException('Token does not exist');
  }
}
