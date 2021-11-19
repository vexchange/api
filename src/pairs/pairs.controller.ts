import { Controller, Get } from '@nestjs/common';
import { Pair } from '../pair';
import { PairsService } from './pairs.service';

@Controller('pairs')
export class PairsController {
  constructor(private readonly pairsService: PairsService) {
    pairsService.initialize();
  }

  @Get()
  async getPairs(): Promise<Pair[]> {
    return this.pairsService.get();
  }
}
