import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Otp extends CommonEntity {
  @Column()
  code: string;

  @Column()
  userId: string;

  @Column()
  withDrawInvoiceId: string;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ type: 'boolean', default: false })
  used: boolean;
}
