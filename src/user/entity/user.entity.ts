import { CommonEntity } from 'src/common/common.entity';
import { Invoice } from 'src/invoice/entity/invoice.entity';
import { Transaction } from 'src/transaction/enum/transaction.entity';
import { Wallet } from 'src/wallet/entity/wallet.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class User extends CommonEntity {
  @OneToMany(() => Wallet, (wallet) => wallet.user, { onDelete: 'CASCADE' })
  wallets: Wallet[];

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ unique: true })
  referralCode: string;

  @Column({ nullable: true })
  fullName: string;

  //fullname // {nullable:true}

  @OneToMany(() => Invoice, (invoice) => invoice.user)
  invoices: Invoice[];

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @OneToMany(() => User, (user) => user.parent)
  children: User[];

  @ManyToOne(() => User, (user) => user.children, { nullable: true })
  parent: User;
}
