import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from './entity/wallet.entity';
import { Repository } from 'typeorm';
import { ICreateWallet } from './interface/create-wallet.interface';
import { UserService } from '../user/user.service';
import { ValidatedJwtUser } from '../auth/interfaces/payload.interface';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet) private walletRepo: Repository<Wallet>,
    private userService: UserService,
  ) {}
  async createWallet(
    wallet: ICreateWallet,
    user: ValidatedJwtUser,
  ): Promise<any> {
    const userExist = await this.userService.findOneById(user.id);
    if (!userExist) throw new BadRequestException('Such a user not found!');

    return await this.walletRepo.save({
      currency: wallet.currency,
      user: userExist,
      name: wallet.name,
      balance: wallet.balance,
    });
  }

  async findOneById(walletId: number): Promise<any> {
    return await this.walletRepo.findOne({
      where: { id: walletId },
    });
  }
}
