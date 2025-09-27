import { CommonEntity } from 'src/common/common.entity';
import { TransactionType } from 'src/common/enums/invoice-type.enum';
import { Invoice } from 'src/invoice/entity/invoice.entity';
import { User } from 'src/user/entity/user.entity';
import { Wallet } from 'src/wallet/entity/wallet.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

@Entity()
export class Transaction extends CommonEntity {
  @ManyToOne(() => User, (user) => user.transactions)
  user: User;

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions)
  wallet: Wallet;

  @OneToOne(() => Invoice, invoice=>invoice.transaction)
  @JoinColumn()
  invoice: Invoice;

  @Column('decimal', { precision: 18, scale: 2 })
  amount: number;

  @Column('decimal', { precision: 18, scale: 2 })
  fee: number;

  @Column('decimal', { precision: 18, scale: 2 })
  netAmount: number;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  transactionTracingCode: string;

  @Column({ nullable: true })
  processedBy: number;


  @BeforeInsert()
  @BeforeUpdate()
  calculateNetAmount() {
    if (this.type === TransactionType.DEPOSIT) {
      this.netAmount = this.amount;
    } else if (this.type === TransactionType.WITHDRAWAL) {
      this.netAmount = this.amount - this.fee;
    }
  }
}
