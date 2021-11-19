import { Test, TestingModule } from '@nestjs/testing';
import { PairsService } from './pairs.service';

describe('PairsService', () => {
  let service: PairsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PairsService],
    }).compile();

    service = module.get<PairsService>(PairsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
