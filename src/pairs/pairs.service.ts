import { Injectable } from '@nestjs/common';
import { Pair } from '../pair';
import { Framework } from '@vechain/connex-framework';
import { Driver, SimpleNet } from '@vechain/connex-driver';
import { find } from 'lodash';
import { VexchangeV2FactoryABI } from '../../abi/VexchangeV2Factory';

@Injectable()
export class PairsService {
  private pairs: Pair[];
  private connex: Connex.Thor;
  private factoryContract: Connex.Thor.Account.Visitor;

  async initialize(): Promise<void> {
    this.pairs = [];
    const net = new SimpleNet('https://mainnet.veblocks.net');
    const driver = await Driver.connect(net);
    this.connex = new Framework(driver).thor;

    this.factoryContract = this.connex.account(
      '0xb312582c023cc4938cf0faea2fd609b46d7509a2',
    );

    this.fetch();
  }

  async fetch(): Promise<void> {
    const allPairsLengthABI = find(VexchangeV2FactoryABI, {
      name: 'allPairsLength',
    });
    let method = this.factoryContract.method(allPairsLengthABI);
    const numPairs = parseInt((await method.call()).decoded[0]);

    const allPairs = find(VexchangeV2FactoryABI, { name: 'allPairs' });
    method = this.factoryContract.method(allPairs);

    for (let i = 0; i < numPairs; ++i) {
      const res = await method.call(i);
      const pairAddress = res.decoded[0];
      this.pairs.push(new Pair(pairAddress, '', '', 0));
    }
  }

  get(): Pair[] {
    return this.pairs;
  }
}
