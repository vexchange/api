import { Test, TestingModule } from '@nestjs/testing';
import { PairsController } from './pairs.controller';

describe('PairsController', () => {
  let controller: PairsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PairsController],
    }).compile();

    controller = module.get<PairsController>(PairsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
