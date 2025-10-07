import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Currency } from './entity/currency.entity';
import { Repository } from 'typeorm';
import { ICreateCurrency } from './interface/create.interface';

@Injectable()
export class CurrencyService {
  constructor(
    @InjectRepository(Currency) private currencyRepo: Repository<Currency>,
  ) {}
  async createCurrency(body: ICreateCurrency): Promise<any> {
    return await this.currencyRepo.save(body);
  }

  async get(): Promise<any> {
    return await this.currencyRepo.find();
  }
}
