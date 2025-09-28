import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from './entity/wallet.entity';
import { Repository } from 'typeorm';
import { ICreateWallet } from './interface/create-wallet.interface';

@Injectable()
export class WalletService {
  constructor(
    // @InjectRepository(Wallet) private walletRepo: Repository<Wallet>,
  ) {}
  async createWallet(wallet: ICreateWallet): Promise<any> {
    
    // return await this.walletRepo.save();
  }
}
