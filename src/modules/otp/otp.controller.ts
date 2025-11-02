import { Body, Controller, Post, Request } from '@nestjs/common';
import { ValidatedJwtUser } from '../auth/interfaces/payload.interface';
import { OtpResendDto } from './dto/requests/otp-resend.dto';
import { OtpDispatcherService } from './otp-dispatcher.service';
import { OtpCodeInsertDto } from './dto/requests/otp-code-insert.dto';
import { OtpResendResponseDto } from './dto/responses/otp-resend.response.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { securitySchemeName } from 'swagger.config';
import { OtpValidateCodeResponseDto } from './dto/responses/otp-validate-code.response.dto';

@ApiBearerAuth(securitySchemeName)
@Controller('otp')
export class OtpController {
  constructor(private otpDispatcheService: OtpDispatcherService) {}

  @Post('resend')
  async otpResend(
    @Body() payload: OtpResendDto,
    @Request() req,
  ): Promise<OtpResendResponseDto> {
    const user: ValidatedJwtUser = req.user;
    return {
      data: await this.otpDispatcheService.otpResendDispatcher(payload, user),
    };
  }

  @Post('validate-code')
  async otpCodeInsert(
    @Body() payload: OtpCodeInsertDto,
    @Request() req,
  ): Promise<OtpValidateCodeResponseDto> {
    const user: ValidatedJwtUser = req.user;
    return await this.otpDispatcheService.otpCodeInsertDispatcher(
      payload,
      user,
    );
  }
}
