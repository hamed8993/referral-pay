import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Otp } from './entity/otp.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OtpWithdrawService } from './strategies/otp-withdraw.service';
import { Repository } from 'typeorm';
import { ValidatedJwtUser } from '../auth/interfaces/payload.interface';
import { IOtpResend } from './interface/otp-resend.interface';
import { OtpTypeEnum } from './enum/otp-type.enum';
import { IOptCodeInsert } from './interface/otp-code-insert.interface';
import { verifyPassword } from 'src/common/helpers/hash-password.helper';
import {
  otpLifeTimeMinutes,
  otpResendWaitingMinutes,
} from './config/otp.config';
import { OtpService } from './otp.service';

@Injectable()
export class OtpDispatcherService {
  constructor(
    @InjectRepository(Otp) private otpRepo: Repository<Otp>,
    private otpWithdrawService: OtpWithdrawService,
    private otpService: OtpService,
  ) {}

  async otpResendDispatcher(
    payload: IOtpResend,
    user: ValidatedJwtUser,
  ): Promise<any> {
    //1,2)check if exist this otp AND if is for this user...
    const existOtp = await this.otpService.checkIfOtpExistForUser(
      payload.otpId,
      user.id.toString(),
    );

    //3)check should resend time not be less that OTP duration ...
    if (
      Date.now() - existOtp.created_at.getTime() <
      otpResendWaitingMinutes * 60 * 1000
    )
      throw new ForbiddenException('Please retry some while later!');

    //4)check this otp is for which service [registeration OR withdraws(both withdraws)]...
    switch (existOtp.type) {
      case OtpTypeEnum.WITHDRW:
        return this.otpWithdrawService.handleResend(existOtp, user);
        break;

      case OtpTypeEnum.REGISTER:
        break;

      case OtpTypeEnum.LOGIN:
        break;

      default:
        throw new BadRequestException('this Otp type is incompatible!');
    }
  }

  async otpCodeInsertDispatcher(
    payload: IOptCodeInsert,
    user: ValidatedJwtUser,
  ): Promise<any> {
    //1,2)check if exist this otp AND if is for this user...
    const existOtp = await this.otpService.checkIfOtpExistForUser(
      payload.otpId,
      user.id.toString(),
    );

    //3)Check if code is expired...
    if (
      Date.now() - existOtp.created_at.getTime() >
      otpLifeTimeMinutes * 60 * 1000
    )
      throw new ForbiddenException('Code is Expired!');

    //4)Is code valid?
    const isCodeCorrect = await verifyPassword(payload.code, existOtp.code);
    if (!isCodeCorrect) throw new BadRequestException('Code is invalid');

    switch (existOtp.type) {
      case OtpTypeEnum.WITHDRW:
        return this.otpWithdrawService.handleCodeCorrectInsert(existOtp, user);
        break;

      case OtpTypeEnum.REGISTER:
        break;

      case OtpTypeEnum.LOGIN:
        break;

      default:
        throw new BadRequestException('this Otp type is incompatible!');
    }
  }
}
