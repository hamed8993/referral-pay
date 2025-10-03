import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Wallet } from 'src/modules/wallet/entity/wallet.entity';
import { Transaction } from 'src/modules/transaction/entity/transaction.entity';
import { Invoice } from 'src/modules/invoice/entity/invoice.entity';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
  imports: [TypeOrmModule.forFeature([User, Wallet, Transaction, Invoice])],
})
export class UserModule {}
