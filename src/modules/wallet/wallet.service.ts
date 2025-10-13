import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import Decimal from 'decimal.js';
// import {
//   getWalletCategoriesArray,
//   WalletCategoryEnum,
// } from './enum/wallet-category.enum';

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
    const walletsArray: // any[]
    {
      // name: WalletCategoryEnum;
      currencies: WalletCurrencyEnum[];
    }[] = [];
    // for (const catName of getWalletCategoriesArray) {
    //   console.log('catName>>>>>', catName);
    //   const wallet = await manager.getRepository(Wallet).save({
    //     user: user,
    //     name: catName, //Translate???
    //     balance: 0,
    //     is_systemic: true,
    //     currencies: getCurrenciesArray,
    //     walletCategory: catName,
    //   });

    //   walletsArray.push({
    //     currencies: wallet.currencies,
    //     name: wallet.name,
    //   });
    // }
    return walletsArray;
  }

  //Todo=>

  // async createDepositAddresseWallt(
  //   address: string,
  //   network: string,
  //   user,
  //   amount,
  // ): Promise<any> {}
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

  async findOneByIdForThisUserId(
    walletId: number,
    userId: number,
  ): Promise<any> {
    return await this.walletRepo.findOne({
      where: { id: walletId, user: { id: userId } },
      relations: ['user'],
    });
  }

  async findOneByAddress(walletAddress: string): Promise<any> {
    return await this.walletRepo.findOne({
      where: { depositAddress: walletAddress },
      relations: ['user'],
    });
  }

  async lockAmountWithManager(
    manager: EntityManager,
    walletId: string,
    amount: number,
  ): Promise<any> {
    const wallet = await manager.findOne(Wallet, {
      where: {
        id: +walletId,
      },
    });
    if (!wallet)
      throw new NotFoundException('wallet not found for locking amount!');

    wallet.lockedBalance = new Decimal(wallet.lockedBalance)
      .plus(amount)
      .toNumber();
    return await manager.save(Wallet, wallet);
  }
}
