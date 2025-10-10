import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Cart } from '../cart/entity/cart.entity';

@Entity()
export class Gateway extends CommonEntity {
  @Column()
  name: string;

  @OneToMany(() => Cart, (cart) => cart.gateway, { nullable: true })
  carts: Cart[];
}
