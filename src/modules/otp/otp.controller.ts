import { Body, Controller, Post, Request } from '@nestjs/common';
import { ValidatedJwtUser } from '../auth/interfaces/payload.interface';
import { OtpResendDto } from './dto/otp-resend.dto';
import { OtpDispatcherService } from './otp-dispatcher.service';
import { OtpCodeInsertDto } from './dto/otp-code-insert.dto';

@Controller('otp')
export class OtpController {
  constructor(private otpDispatcheService: OtpDispatcherService) {}

  @Post('resend')
  async otpResend(@Body() payload: OtpResendDto, @Request() req): Promise<any> {
    const user: ValidatedJwtUser = req.user;
    return await this.otpDispatcheService.otpResendDispatcher(payload, user);
  }

  @Post('validate-code')
  async otpCodeInsert(
    @Body() payload: OtpCodeInsertDto,
    @Request() req,
  ): Promise<any> {
    const user: ValidatedJwtUser = req.user;
    return await this.otpDispatcheService.otpCodeInsertDispatcher(payload, user);
  }
}
