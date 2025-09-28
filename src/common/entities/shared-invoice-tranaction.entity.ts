import { Column, ManyToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { TransactionType } from '../enums/transaction-type.enum';
import { Wallet } from 'src/wallet/entity/wallet.entity';

export abstract class SharedInvoiceTranaction extends CommonEntity {
  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions)
  wallet: Wallet;
}
