import { CommonEntity } from 'src/common/entities/common.entity';
import { User } from 'src/modules/user/entity/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { DepositAddressEnum } from './enum/depositd-address.enum';
import { Wallet } from 'src/modules/wallet/entity/wallet.entity';
import { Balance } from 'src/modules/balance/entity/balance.entity';

@Entity()
export class DepositAddress extends CommonEntity {
//   @ManyToOne(() => User, (user) => user.depositAddresses)
//   user: User;

  //   @ManyToOne(() => Wallet, (wallet) => wallet.depositAddresses)
  //   wallet: Wallet;

  @ManyToOne(() => Balance, (balance) => balance.depositAddresses)
  balance: Balance;

  @Column()
  network: string;

  @Column()
  address: string;

  @Column({ type: 'enum', enum: DepositAddressEnum })
  status: DepositAddressEnum;

  @Column({ type: 'json', nullable: true })
  metadata: any;
}
