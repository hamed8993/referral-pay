import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencyController } from './currency.controller';
import { Currency } from './entity/currency.entity';
import { CurrencyService } from './currency.service';

@Module({
    imports: [TypeOrmModule.forFeature([Currency])],
    providers:[CurrencyService],
    controllers:[CurrencyController]
})
export class CurrencyModule {}
