import { PairsController } from '../../src/controllers/pairs.controller';
import { OnchainDataService } from '@services/onchain-data.service';
import { Test } from '@nestjs/testing';
import { allPairs } from '../mocks/pairs';
import { CoinGeckoService } from '@services/coin-gecko.service';

describe('PairsController', () => {
  let pairsController: PairsController;
  let onchainDataService: OnchainDataService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [PairsController],
      providers: [CoinGeckoService, OnchainDataService],
    }).compile();

    onchainDataService = moduleRef.get<OnchainDataService>(OnchainDataService);
    pairsController = moduleRef.get<PairsController>(PairsController);
  });

  describe('getPairs', () => {
    it('should return all pairs', async () => {
      jest
        .spyOn(onchainDataService, 'getAllPairs')
        .mockImplementation(() => allPairs);

      expect(pairsController.getPairs()).toBe(allPairs);
    });
  });
});
