import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Otp } from './entity/otp.entity';
import { Repository } from 'typeorm';
import { IOtp } from './interface/IOtp.interface';
import { hashPassword } from 'src/common/helpers/hash-password.helper';

@Injectable()
export class OtpService {
  private readonly otpLifetimeMinutes = 6;
  private readonly otpDigits = 6;

  constructor(@InjectRepository(Otp) private otpRepo: Repository<Otp>) {}
  async createOpt(body: IOtp): Promise<string> {
    const otpCode = this._createOtpCode(this.otpDigits);
    const otp = this.otpRepo.create({
      ...body,
      code: await hashPassword(otpCode),
      expiresAt: new Date(Date.now() + this.otpLifetimeMinutes * 60 * 1000),
    });
    await this.otpRepo.save(otp);
    return otpCode;
  }

  private _createOtpCode(length: number): string {
    return Math.floor(Math.random() * Math.pow(10, length))
      .toString()
      .padStart(length, '0');
  }

  async checkOptCode(userId: string): Promise<any> {
    const existOptCode = await this.otpRepo.findOne({
      where: {
        userId,
        used: false,
      },
    });
    if (!existOptCode || existOptCode.expiresAt < new Date())
      throw new BadGatewayException('Code is Invalid!');

    existOptCode.used = true;
    await this.otpRepo.save(existOptCode);
    return true;
  }
}
