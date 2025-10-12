import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Cart } from '../../cart/entity/cart.entity';
import { GatewayType } from 'src/common/enums/gateway-type.enum';

@Entity()
export class Gateway extends CommonEntity {
  @Column()
  name: string; //zarinpal , ....

  @Column({ type: 'enum', enum: GatewayType })
  gatewayType: GatewayType;

  @Column()
  handler: string;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  displayName: string; // 'درگاه زرین پال'

  @Column('json', { nullable: true })
  credentials: {
    merchantId?: string;
    apiKey?: string;
    terminalId?: string;
    username?: string;
    password?: string;
    privateKey?: string;
    certificate?: string;
    [key: string]: any;
  };

  @Column('json', { nullable: true })
  endpoints: {
    sandbox: {
      requestUrl: string;
      paymentUrl: string;
      callbackUrl: string;
      verifyUrl: string;
      [key: string]: any;
    };
    production: {
      requestUrl: string;
      paymentUrl: string;
      callbackUrl: string;
      verifyUrl: string;
      [key: string]: any;
    };
  };

  @Column({ type: 'json', nullable: true })
  additionalConfig: Record<string, string | number>;

  @Column({ nullable: true })
  imgUrl: string;
  // @OneToMany(() => Cart, (cart) => cart.gateway, { nullable: true })
  // carts: Cart[];
}
