import { Exclude } from 'class-transformer';
import { CommonEntity } from 'src/common/entities/common.entity';
import { EnrollmentStatus } from 'src/common/enums/enrollment.enum';
import { RoleEnum } from 'src/common/enums/role.enum';
import { UserLevel } from 'src/common/enums/user-level.enum';
import { UserStatus } from 'src/common/enums/user-status.enum';
import { Cart } from 'src/modules/cart/entity/cart.entity';
import { Invoice } from 'src/modules/invoice/entity/invoice.entity';
import { Transaction } from 'src/modules/transaction/entity/transaction.entity';
import { Wallet } from 'src/modules/wallet/entity/wallet.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class User extends CommonEntity {
  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ unique: true })
  referralCode: string;

  @Column({ nullable: true })
  fullName: string;

  @Column('enum', { enum: RoleEnum, default: RoleEnum.USER })
  role: RoleEnum;

  @Column('enum', { enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Column('enum', { enum: EnrollmentStatus, default: EnrollmentStatus.BASIC })
  enrollment: EnrollmentStatus;

  @Column('enum', { enum: UserLevel, default: UserLevel.ONE })
  level: UserLevel;

  @Column({ nullable: true })
  profileImgUrl: string;

  @OneToMany(() => Wallet, (wallet) => wallet.user, { onDelete: 'CASCADE' })
  wallets: Wallet[];

  @OneToMany(() => Invoice, (invoice) => invoice.user, { onDelete: 'CASCADE' })
  invoices: Invoice[];

  @OneToMany(() => Transaction, (transaction) => transaction.user, {
    onDelete: 'CASCADE',
  })
  transactions: Transaction[];

  @OneToMany(() => User, (user) => user.parent)
  children: User[];

  @ManyToOne(() => User, (user) => user.children, { nullable: true })
  parent: User;

  @OneToMany(() => Cart, (cart) => cart.user, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  carts: Cart[];
  
}
