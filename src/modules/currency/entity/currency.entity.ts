import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Currency extends CommonEntity {
  @Column()
  symbol: string;

  @Column()
  name: string;

  @Column()
  networks: string[];

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column()
  icon_url: string;
}
