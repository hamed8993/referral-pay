import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { CreateGatewayDto } from './dto/requests/create-gateway.dto';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { RoleEnum } from 'src/common/enums/role.enum';
import { Public } from '../auth/decorators/public.decorator';
import { Request } from 'express';
import { CreateGatewayResponseDto } from './dto/responses/create-gateway.response.dto';

@Controller('gateway')
export class GatewayController {
  constructor(private gatewayService: GatewayService) {}

  @Roles(RoleEnum.ADMIN)
  @UseGuards(RoleGuard)
  @Post('create')
  // @ApiResponse({ type: CreateGatewayResponseDto })
  async createGateway(
    @Body() body: CreateGatewayDto,
  ): Promise<CreateGatewayResponseDto> {
    return {
      data: await this.gatewayService.createGateway(body),
    };
  }

  // @Post('payment')
  // async bankPayment(@Res() res: Response) {
  //   const authorityUrl = await this.gatewayService.bankPayment();
  //   return res.redirect(authorityUrl);
  // }

  @Public()
  @Get('callback')
  async callback(@Req() req: Request) {
    return await this.gatewayService.paymentCallback(req);
  }

  // @Public()
  // @Get('callback/paypal')
  // async pCallback(@Req() req: Request) {
  //   return await this.gatewayService.checkPayment(req);
  //   // console.log('5555555>>', req.url);
  // }
}
