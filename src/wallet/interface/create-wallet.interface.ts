import { User } from 'src/user/entity/user.entity';
import { Transaction } from 'typeorm';

export interface ICreateWallet {
  balance: number;

  userId: number;

  name: string;

  currency: string;
  
}
