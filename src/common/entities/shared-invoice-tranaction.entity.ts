import { Column } from 'typeorm';
import { CommonEntity } from './common.entity';
import { TransactionType } from '../enums/transaction-type.enum';

export abstract class SharedInvoiceTranaction extends CommonEntity {
  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  // @Column({
  //   type: 'enum',
  //   enum: WalletCurrencyEnum,
  //   default: WalletCurrencyEnum.USD,
  // })
  // fromCurrency: WalletCurrencyEnum;

  // @Column({
  //   type: 'enum',
  //   enum: WalletCurrencyEnum,
  //   default: WalletCurrencyEnum.USD,
  // })
  // toCurrency: WalletCurrencyEnum;

  @Column({ nullable: true })
  fromWalletAddress: string;

  @Column({ nullable: true })
  toWalletAddress: string;

  @Column({ nullable: true })
  toBankCartId: string;
}
