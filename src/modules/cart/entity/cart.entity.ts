import { CommonEntity } from 'src/common/entities/common.entity';
import { Gateway } from 'src/modules/payment/entity.gateway';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Cart extends CommonEntity {
  @Column()
  bankName: string;

  @Column({ type: 'varchar', length: 16 })
  bankNumber: number;

  @ManyToOne(() => Gateway, (gateway) => gateway.carts)
  gateway: Gateway;
}
