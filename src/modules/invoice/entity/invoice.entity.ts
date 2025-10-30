import { InvoiceStatus } from 'src/common/enums/invoice-status.enum';
import { Transaction } from 'src/modules/transaction/entity/transaction.entity';
import { User } from 'src/modules/user/entity/user.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { Decimal } from 'decimal.js';
import { SharedInvoiceTranaction } from 'src/common/entities/shared-invoice-tranaction.entity';
import { Wallet } from 'src/modules/wallet/entity/wallet.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Invoice extends SharedInvoiceTranaction {
  @Column('decimal', { precision: 18, scale: 2 })
  subtotal: number;

  @Column('decimal', { precision: 18, scale: 2, default: 0 })
  tax: number;

  @Column('decimal', { precision: 18, scale: 2, default: 0 })
  discount: number;

  @Column({
    type: 'enum',
    enum: InvoiceStatus,
    default: InvoiceStatus.PENDING,
  })
  status: InvoiceStatus;

  @Column({ unique: true })
  invoiceNumber: string;

  @Column()
  paymentGatewayId: string;

  @Exclude()
  @Column({ nullable: true })
  paymentGatewayAuthority: string;

  @Column({ nullable: true })
  paymentReference: string; //?????

  @Column({ nullable: true })
  userCancellDescription: string;

  @Exclude()
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

  @ManyToOne(() => Wallet, (wallet) => wallet.outgoingInvoices, {
    nullable: true,
  })
  fromWallet: Wallet;

  @ManyToOne(() => Wallet, (wallet) => wallet.incomingInvoices, {
    nullable: true,
  })
  toWallet: Wallet;

  @Column('decimal', { precision: 18, scale: 2 })
  totalAmount: number;

  @Exclude()
  @Column({ nullable: true, default: null })
  depositDocUrl: string;

  @BeforeInsert()
  @BeforeUpdate()
  calculateTotalAmount() {
    const subtotal = new Decimal(this.subtotal || 0);
    const tax = new Decimal(this.tax || 0);
    const discount = new Decimal(this.discount || 0);
    this.totalAmount = subtotal.plus(tax).minus(discount).toNumber();
  }

  @BeforeInsert()
  generateInvoiceNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const time = date.getTime().toString().slice(-4);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();

    this.invoiceNumber = `INV-${year}${month}${day}-${time}-${random}`;
  }
}
