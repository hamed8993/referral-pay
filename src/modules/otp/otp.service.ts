import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Otp } from './entity/otp.entity';
import { EntityManager, Repository } from 'typeorm';
import { IOtp } from './interface/otp.interface';
import { hashPassword } from 'src/common/helpers/hash-password.helper';

type CreateOtpResultType = { otpSavedRes: Otp; rawOtpCode: string };

@Injectable()
export class OtpService {
  private readonly otpLifetimeMinutes = 6;

  private readonly otpDigits = 6;

  constructor(@InjectRepository(Otp) private otpRepo: Repository<Otp>) {}

  async createOtp(body: IOtp): Promise<CreateOtpResultType> {
    const otpCode = this._createOtpCode(this.otpDigits);
    const otp = this.otpRepo.create({
      ...body,
      code: await hashPassword(otpCode),
      expiresAt: new Date(Date.now() + this.otpLifetimeMinutes * 60 * 1000),
    });
    return { otpSavedRes: await this.otpRepo.save(otp), rawOtpCode: otpCode };
  }

  async createOtpByManager(manager: EntityManager, body: IOtp): Promise<CreateOtpResultType> {
    const otpCode = this._createOtpCode(this.otpDigits);
    const otp = manager.create(Otp, {
      ...body,
      code: await hashPassword(otpCode),
      expiresAt: new Date(Date.now() + this.otpLifetimeMinutes * 60 * 1000),
    });
    const otpSavedRes = await manager.save(Otp, otp);
    return { otpSavedRes, rawOtpCode: otpCode };
  }

  private _createOtpCode(length: number): string {
    return Math.floor(Math.random() * Math.pow(10, length))
      .toString()
      .padStart(length, '0');
  }

  async checkOtpCode(userId: string): Promise<any> {
    const existOtpCode = await this.otpRepo.findOne({
      where: {
        userId,
        used: false,
      },
    });
    if (!existOtpCode || existOtpCode.expiresAt < new Date())
      throw new BadGatewayException('Code is Invalid!');

    existOtpCode.used = true;
    await this.otpRepo.save(existOtpCode);
    return true;
  }
}
