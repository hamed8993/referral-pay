import { CommonEntity } from 'src/common/entities/common.entity';
import { WalletStatus } from 'src/common/enums/wallet-status.enum';
import { Transaction } from 'src/transaction/entity/transaction.entity';
import { User } from 'src/user/entity/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Wallet extends CommonEntity {
  @Column({ type: 'enum', enum: WalletStatus, default: WalletStatus.ACTIVE })
  status: WalletStatus;

  @Column()
  name: string;

  @Column('decimal', { precision: 18, scale: 2, default: 0 })
  balance: number;

  @ManyToOne(() => User, (user) => user.wallets)
  user: User;

  @OneToMany(() => Transaction, (transaction) => transaction.wallet)
  transactions: Transaction[];

  @Column({ default: 'USD' }) //default....?????
  currency: string;
}
