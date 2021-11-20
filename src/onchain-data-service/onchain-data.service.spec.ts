import { Test, TestingModule } from '@nestjs/testing';
import { OnchainDataService } from './onchain-data.service';

describe('PairsService', () => {
  let service: OnchainDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OnchainDataService],
    }).compile();

    service = module.get<OnchainDataService>(OnchainDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
