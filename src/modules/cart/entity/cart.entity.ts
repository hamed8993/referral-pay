import { CommonEntity } from 'src/common/entities/common.entity';
import { Gateway } from 'src/modules/gateway/entity/gateway.entity';
import { User } from 'src/modules/user/entity/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Cart extends CommonEntity {
  @Column()
  bankName: string;

  @Column({ type: 'varchar', length: 16 })
  bankNumber: number;

  @ManyToOne(() => User, (user) => user.carts)
  user: User;

  //   @ManyToOne(() => Gateway, (gateway) => gateway.carts)
  //   gateway: Gateway;
}
