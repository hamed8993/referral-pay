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

@Injectable()
export class OtpDispatcherService {
  private readonly otpResendWaitingMinutes = 1;
  constructor(
    @InjectRepository(Otp) private otpRepo: Repository<Otp>,
    private otpWithdrawService: OtpWithdrawService,
  ) {}

  async otpResendDispatcher(
    payload: IOtpResend,
    user: ValidatedJwtUser,
  ): Promise<any> {
    const existOtp = await this.otpRepo.findOne({
      where: {
        id: +payload.otpId,
      },
    });
    //1)check if exist this otp...
    if (!existOtp) throw new NotFoundException('Not found such a Otp! ');

    //2)check if this otp id for this user...
    if (existOtp.userId !== user.id.toString())
      throw new BadRequestException(
        'Oooops! Forbidden! this Otp is not for you!',
      );

    //3)check should resend time not be less that OTP expiration ...
    if (
      Date.now() - existOtp.created_at.getTime() <
      this.otpResendWaitingMinutes * 60 * 1000
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
}
