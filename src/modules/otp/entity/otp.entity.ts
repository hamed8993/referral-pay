import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity } from 'typeorm';
import { OtpTypeEnum } from '../enum/otp-type.enum';

@Entity()
export class Otp extends CommonEntity {
  @Column()
  code: string;

  @Column()
  userId: string;

  @Column({ type: 'enum', enum: OtpTypeEnum })
  type: OtpTypeEnum;

  @Column()
  withDrawInvoiceId?: string;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ type: 'boolean', default: false })
  used: boolean;
}
