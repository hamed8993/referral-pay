import { Body, Controller, Post, Request } from '@nestjs/common';
import { TransferDto } from './dto/requests/transfer.dto';
import { TransferService } from './transfer.service';
import { ValidatedJwtUser } from '../auth/interfaces/payload.interface';

@Controller('transfer')
export class TransferController {
  constructor(private transferService: TransferService) {}
  @Post('create')
  async transferCreate(
    @Body() body: TransferDto,
    @Request() req,
  ): Promise<any> {
    const user: ValidatedJwtUser = req.user;
    return await this.transferService.dispatcher(body, user);
  }
}
