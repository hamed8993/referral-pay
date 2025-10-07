import { Column, ManyToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { TransactionType } from '../enums/transaction-type.enum';
import { Wallet } from 'src/modules/wallet/entity/wallet.entity';
import { WalletTypeEnum } from 'src/modules/wallet/enum/wallet-type.enum';
import { Optional } from '@nestjs/common';
import { WalletCurrencyEnum } from 'src/modules/wallet/enum/wallet-currency.enum';

export abstract class SharedInvoiceTranaction extends CommonEntity {
  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: WalletCurrencyEnum,
    default: WalletCurrencyEnum.USD,
  })
  fromCurrency: WalletCurrencyEnum;

  @Column({
    type: 'enum',
    enum: WalletCurrencyEnum,
    default: WalletCurrencyEnum.USD,
  })
  toCurrency: WalletCurrencyEnum;

  @Optional()
  @Column()
  fromWalletAddress: string;

  @Optional()
  @Column()
  toWalletAddress: string;
}
