import { CommonEntity } from 'src/common/entities/common.entity';
import { WalletStatus } from 'src/common/enums/wallet-status.enum';
import { Transaction } from 'src/modules/transaction/entity/transaction.entity';
import { User } from 'src/modules/user/entity/user.entity';
import { Column,
         Entity, 
         ManyToOne, 
         OneToMany } from 'typeorm';

import { Invoice } from 'src/modules/invoice/entity/invoice.entity';
import { WalletTypeEnum } from '../enum/wallet-type.enum';

@Entity()
export class Wallet extends CommonEntity {
  @Column()
  name: string;

  @Column({ type: 'enum', enum: WalletStatus, default: WalletStatus.ACTIVE })
  status: WalletStatus;

  @Column({ type: 'enum', enum: WalletTypeEnum })
  type: WalletTypeEnum;

  @Column({ nullable: true })
  depositAddress: string;

  @Column('decimal', { precision: 18, scale: 2, default: 0 })
  balance: number;

  @Column('decimal', { precision: 18, scale: 2, default: 0 })
  lockedBalance: number;

  @ManyToOne(() => User, (user) => user.wallets)
  user: User;

  @OneToMany(() => Transaction, (transaction) => transaction.fromWallet)
  outgoingTrxs: Transaction[];

  @OneToMany(() => Transaction, (transaction) => transaction.toWallet)
  incomingTrxs: Transaction[];

  @OneToMany(() => Invoice, (invoice) => invoice.toWallet)
  incomingInvoices: Invoice[];

  @OneToMany(() => Invoice, (invoice) => invoice.fromWallet)
  outgoingInvoices: Invoice[];

  // @OneToMany(
  //   () => DepositAddress,
  //   (depositAddresses) => depositAddresses.wallet,
  //   { nullable: true },
  // )
  // depositAddresses: DepositAddress[];
}
