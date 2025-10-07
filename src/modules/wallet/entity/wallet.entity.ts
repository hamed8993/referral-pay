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

@Entity()
export class Wallet extends CommonEntity {
  @Column({ type: 'enum', enum: WalletStatus, default: WalletStatus.ACTIVE })
  status: WalletStatus;

  @Column()
  name: string;

  @Column('decimal', { precision: 18, scale: 2, default: 0 })
  balances: number;

  @Column({ type: 'enum', enum: WalletCategoryEnum })
  walletCategory: WalletCategoryEnum;

  @Column({ type: 'boolean', default: true })
  is_systemic: boolean;

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

  //1 :
  // @Column({
  //   type: 'simple-array',
  //   default: getCurrenciesArray.join(','), // ذخیره به صورت رشته جدا شده با کاما
  // })
  // currencies: string[];

  //2:
  // @Column({
  //   type: 'simple-json',
  //   default: JSON.stringify(getCurrenciesArray) // ذخیره به صورت JSON
  // })
  // currencies: string[];

  //3:
  // @Column({
  //   type: 'simple-array',
  //   default: () => `('${getCurrenciesArray.join("','")}')`,
  // })
  // currencies: WalletCurrencyEnum[];

  // //4: ///************************ */
  // @Column({
  //   type: 'simple-array',
  // })
  // currencies: WalletCurrencyEnum[];
  @Column({
    type: 'simple-array',
  })
  currencies: WalletCurrencyEnum[];

  // @BeforeInsert()
  // setDefaultCurrencies() {
  //   if (!this.currencies || this.currencies.length === 0) {
  //     this.currencies = getCurrenciesArray;
  //   }
  // }

  // @AfterLoad()
  // @BeforeInsert()
  // xx() {
  //   this.currencies = 'getCurrenciesArray';
  // }
  // constructor() {
  //   super();
  //   this.currencies = getCurrenciesArray;
  // }

  //5: //ERROR: => Mysql does not support array.
  // @Column({
  //   type: 'enum',
  //   enum: WalletCurrencyEnum,
  //   array: true,
  // })
  // currencies: WalletCurrencyEnum[];

  // @Column({
  //   type:'simple-array',
  //   default:[1,2]
  // type: 'array',
  // type: 'simple-json',
  // default: '[a,2]',
  // default: Object.values(WalletCurrencyEnum),
  // default: JSON.stringify(['a', 2]),
  // })
  // currencies: number[];
  // currencies: WalletCurrencyEnum[] = Object.values(WalletCurrencyEnum);
}
