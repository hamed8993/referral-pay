import { CommonEntity } from 'src/common/common.entity';
import { InvoiceStatus } from 'src/common/enums/invoice-status.enum';
import { Transaction } from 'src/transaction/enum/transaction.entity';
import { User } from 'src/user/entity/user.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToOne,
} from 'typeorm';

@Entity()
export class Invoice extends CommonEntity {
  @Column('decimal', { precision: 18, scale: 2 })
  subtotal: number;

  @Column('decimal', { precision: 18, scale: 2, default: 0 })
  tax: number;

  @Column('decimal', { precision: 18, scale: 2, default: 0 })
  discount: number;

  @Column('decimal', { precision: 18, scale: 2 })
  totalAmount: number;

  @Column({
    type: 'enum',
    enum: InvoiceStatus,
    default: InvoiceStatus.PENDING,
  })
  status: InvoiceStatus;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ unique: true })
  invoiceNumber: string;

  @Column({ nullable: true })
  paymentGateway: string;

  @Column({ nullable: true })
  paymentReference: string;

  @Column({ nullable: true })
  userCancellDescription: string;

  @Column({ nullable: true })
  processedBy: number;

  @Column({ nullable: true })
  adminNote: string;

  @Column({ nullable: true, type: 'timestamp' })
  processedAt: Date;

  @ManyToOne(() => User, (user) => user.invoices)
  user: User;

  @OneToOne(() => Transaction, (transaction) => transaction.invoice, {
    nullable: true,
  })
  transaction: Transaction;

  @BeforeInsert()
  @BeforeUpdate()
  calculateTotalAmount() {
    this.totalAmount = this.subtotal - this.discount + this.tax;
  }
}
