import {
  BadGatewayException,
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Otp } from './entity/otp.entity';
import { EntityManager, Repository } from 'typeorm';
import { IOtp } from './interface/otp.interface';
import { hashPassword } from 'src/common/helpers/hash-password.helper';
import { InavalidateOtResponse } from './type/invalidate-otp-response';
import { otpDigits, otpLifeTimeMinutes } from './config/otp.config';

type CreateOtpResultType = { otpSavedRes: Otp; rawOtpCode: string };

@Injectable()
export class OtpService {
  constructor(@InjectRepository(Otp) private otpRepo: Repository<Otp>) {}

  async createOtp(body: IOtp): Promise<CreateOtpResultType> {
    const otpCode = this._createOtpCode(otpDigits);
    const otp = this.otpRepo.create({
      ...body,
      code: await hashPassword(otpCode),
      expiresAt: new Date(Date.now() + otpLifeTimeMinutes * 60 * 1000),
    });
    return { otpSavedRes: await this.otpRepo.save(otp), rawOtpCode: otpCode };
  }

  async createOtpByManager(
    manager: EntityManager,
    body: IOtp,
  ): Promise<CreateOtpResultType> {
    const otpCode = this._createOtpCode(otpDigits);
    const otp = manager.create(Otp, {
      ...body,
      code: await hashPassword(otpCode),
      expiresAt: new Date(Date.now() + otpLifeTimeMinutes * 60 * 1000),
    });
    const otpSavedRes = await manager.save(Otp, otp);
    return { otpSavedRes, rawOtpCode: otpCode };
  }

  private _createOtpCode(length: number): string {
    return Math.floor(Math.random() * Math.pow(10, length))
      .toString()
      .padStart(length, '0');
  }

  async invalidateOtp(otp: Otp): Promise<InavalidateOtResponse> {
    otp.used = true;
    await this.otpRepo.save(otp);

    return {
      result: true,
      updatedOtp: otp,
    };
  }

  async invalidateOtpByManager(
    manager: EntityManager,
    otp: Otp,
  ): Promise<InavalidateOtResponse> {
    otp.used = true;
    const res = await manager.save(otp);

    return {
      result: true,
      updatedOtp: res,
    };
  }

  async checkIfOtpExistForUser(otpId: string, userId: string): Promise<Otp> {
    const existOtp = await this.otpRepo.findOne({
      where: {
        id: +otpId,
      },
    });
    //1)check if exist this otp...
    if (!existOtp) throw new NotFoundException('Not found such a Otp! ');

    //2)check if this otp id for this user...
    if (existOtp.userId !== userId)
      throw new BadRequestException(
        'Oooops! Forbidden! this Otp is not for you!',
      );

    return existOtp;
  }
}
