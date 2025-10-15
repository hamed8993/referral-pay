import { SharedInvoiceTranaction } from 'src/common/entities/shared-invoice-tranaction.entity';
import { TransactionType } from 'src/common/enums/transaction-type.enum';
import { Invoice } from 'src/modules/invoice/entity/invoice.entity';
import { User } from 'src/modules/user/entity/user.entity';
import { Wallet } from 'src/modules/wallet/entity/wallet.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';

@Entity()
export class Transaction extends SharedInvoiceTranaction {
  @ManyToOne(() => User, (user) => user.transactions)
  user: User;

  @OneToOne(() => Invoice, (invoice) => invoice.transaction)
  @JoinColumn()
  invoice: Invoice;

  @Column('decimal', { precision: 18, scale: 2 })
  amount: number;

  // @Column('decimal', { precision: 18, scale: 2 })
  // fee: number;

  // @Column('decimal', { precision: 18, scale: 2 })
  // netAmount: number;

  @Column({ nullable: true })
  transactionTracingCode: string;

  @Column({ nullable: true })
  processedBy: number;

  @ManyToOne(() => Wallet, (wallet) => wallet.incomingTrxs, { nullable: true })
  toWallet: Wallet;

  @ManyToOne(() => Wallet, (wallet) => wallet.outgoingTrxs, { nullable: true })
  fromWallet: Wallet;

  // @BeforeInsert()
  // @BeforeUpdate()
  // calculateNetAmount() {
  //   if (this.type === TransactionType.DEPOSIT) {
  //     this.netAmount = this.amount;
  //   } else if (this.type === TransactionType.WITHDRAWAL) {
  //     this.netAmount = this.amount - this.fee;
  //   }
  // }
}
