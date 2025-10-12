import { Body, Controller, Post, Request } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { ValidatedJwtUser } from '../auth/interfaces/payload.interface';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Post('create')
  async createCart(@Body() cart: CreateCartDto, @Request() req): Promise<any> {
    const user: ValidatedJwtUser = req.user;
    return await this.cartService.createCart(cart, user);
  }
}
