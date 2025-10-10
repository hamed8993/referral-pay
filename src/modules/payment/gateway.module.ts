import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gateway } from './entity.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Gateway])],
})
export class GatewayModule {}
