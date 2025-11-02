import { Body, Controller, Post, Request } from '@nestjs/common';
import { CreateCartDto } from './dto/requests/create-cart.dto';
import { ValidatedJwtUser } from '../auth/interfaces/payload.interface';
import { CartService } from './cart.service';
import { CreateCartResponseDto } from './dto/responses/create-cart.respnse.dto';
import { securitySchemeName } from 'swagger.config';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth(securitySchemeName)
@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Post('create')
  async createCart(
    @Body() cart: CreateCartDto,
    @Request() req,
  ): Promise<CreateCartResponseDto> {
    const user: ValidatedJwtUser = req.user;
    return { data: await this.cartService.createCart(cart, user) };
  }
}
