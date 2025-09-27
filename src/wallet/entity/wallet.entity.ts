import { CommonEntity } from 'src/common/common.entity';
import { WalletStatus } from 'src/common/enums/wallet-status.enum';
import { Transaction } from 'src/transaction/enum/transaction.entity';
import { User } from 'src/user/entity/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Wallet extends CommonEntity {
  @Column({ type: 'enum', enum: WalletStatus, default: WalletStatus.ACTIVE })
  status: WalletStatus;

  @Column('decimal', { precision: 18, scale: 2, default: 0 })
  balance: number;

  @OneToMany(() => User, (user) => user.wallets, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => Transaction, (transaction) => transaction.wallet)
  transactions: Transaction[];

  @Column({ length: 10 })
  currency: string;
}
