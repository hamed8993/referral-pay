import { CommonEntity } from 'src/common/entities/common.entity';
import { WalletStatus } from 'src/common/enums/wallet-status.enum';
import { Transaction } from 'src/modules/transaction/entity/transaction.entity';
import { User } from 'src/modules/user/entity/user.entity';
import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import {
  getCurrenciesArray,
  WalletCurrencyEnum,
} from '../enum/wallet-currency.enum';
import { Invoice } from 'src/modules/invoice/entity/invoice.entity';
import { WalletCategoryEnum } from '../enum/wallet-category.enum';
import { DepositAddress } from 'src/modules/deposit-address/entity/deposit-address.entity';
import { Balance } from 'src/modules/balance/entity/balance.entity';

@Entity()
export class Wallet extends CommonEntity {
  @Column({ type: 'enum', enum: WalletStatus, default: WalletStatus.ACTIVE })
  status: WalletStatus;

  @Column({ type: 'enum', enum: WalletCategoryEnum })
  name: WalletCategoryEnum;

  // @Column('decimal', { precision: 18, scale: 2, default: 0 })
  // balances: number;

  @Column({ type: 'enum', enum: WalletCategoryEnum })
  walletCategory: WalletCategoryEnum;

  // @Column({ type: 'boolean', default: true })
  // is_systemic: boolean;

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

  @OneToMany(() => Balance, (balance) => balance.wallet)
  balances: Balance[];
}
