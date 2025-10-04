import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from './entity/wallet.entity';
import { EntityManager, Repository } from 'typeorm';
import { ICreateWallet } from './interface/create-wallet.interface';
import { UserService } from '../user/user.service';
import { ValidatedJwtUser } from '../auth/interfaces/payload.interface';
import {
  getCurrenciesArray,
  WalletCurrencyEnum,
} from './enum/wallet-currency.enum';
import { User } from '../user/entity/user.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet) private walletRepo: Repository<Wallet>,
    private userService: UserService,
  ) {}

  async autoCreateSystemWallet(
    user: User,
    manager: EntityManager,
  ): Promise<any> {
    const walletsArray: { name: string; currency: WalletCurrencyEnum }[] = [];
    for (const currencyName of getCurrenciesArray) {
      const wallet = await manager.getRepository(Wallet).save({
        currency: currencyName,
        user: user,
        name: `system-${currencyName}-wallet`,
        balance: 0,
        is_systemic: true,
      });

      walletsArray.push({
        currency: wallet.currency,
        name: wallet.name,
      });
    }
    return walletsArray;
  }

  //Todo=>
  // async createExternalWalletByUserForWithdrawal(wallet:,user: ValidatedJwtUser) {
  //   const userExist = await this.userService.findOneById(user.id);
  //   if (!userExist) throw new BadRequestException('Such a user not found!');
  //    return await this.walletRepo.save({
  //       currency: currencyName,
  //       user: userExist,
  //       name: `system-${currencyName}-wallet`,
  //       balance: 0,
  //       is_systemic: true,
  //     });
  // }

  async findOneById(walletId: number): Promise<any> {
    return await this.walletRepo.findOne({
      where: { id: walletId },
    });
  }
}
