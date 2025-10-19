import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entity/cart.entity';
import { EntityManager, Repository } from 'typeorm';
import { ValidatedJwtUser } from '../auth/interfaces/payload.interface';
import { ICreateCart } from './interface/create-cart.interface';

@Injectable()
export class CartService {
  constructor(@InjectRepository(Cart) private cartRepo: Repository<Cart>) {}

  async createCart(body: ICreateCart, user: ValidatedJwtUser): Promise<any> {
    // const
    return await this.cartRepo.save(body);
  }

  async findOneById(id: string): Promise<any> {
    return await this.cartRepo.findOne({
      where: {
        id: +id,
      },
      relations: ['user'],
    });
  }

  async findOneByIdByManager(manager: EntityManager, id: string): Promise<any> {
    return await manager.findOne(Cart, {
      where: {
        id: +id,
      },
      relations: ['user'],
    });
  }
}
