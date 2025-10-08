import { CommonEntity } from 'src/common/entities/common.entity';
import { DepositAddress } from 'src/modules/deposit-address/entity/deposit-address.entity';
import { Wallet } from 'src/modules/wallet/entity/wallet.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Balance extends CommonEntity {
  @ManyToOne(() => Wallet, (wallet) => wallet.balances)
  wallet: Wallet;

  @OneToMany(() => DepositAddress, (depositAddress) => depositAddress.balance, {
    nullable: true,
  })
  depositAddresses: DepositAddress[];

  @Column()
  currency: string;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  lockedAmount: number;
}
