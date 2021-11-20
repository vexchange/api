import { Test, TestingModule } from '@nestjs/testing';
import { CoinGeckoServiceService } from './coin-gecko.service';

describe('CoinGeckoServiceService', () => {
  let service: CoinGeckoServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoinGeckoServiceService],
    }).compile();

    service = module.get<CoinGeckoServiceService>(CoinGeckoServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
