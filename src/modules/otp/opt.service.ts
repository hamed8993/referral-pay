import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Otp } from './entity/otp.entity';
import { Repository } from 'typeorm';
import { IOtp } from './interface/IOtp.interface';

@Injectable()
export class OtpService {
  private readonly otpLifetimeMinutes = 6;

  constructor(@InjectRepository(Otp) private otpRepo: Repository<Otp>) {}
  async createOpt(body: IOtp): Promise<any> {
    const otp = this.otpRepo.create({
      ...body,
      code: this.createOtpCode(6),
      expiresAt: new Date(Date.now() + this.otpLifetimeMinutes * 60 * 1000),
    });
    return await this.otpRepo.save(otp);
  }

  createOtpCode(length: number): string {
    return Math.floor(Math.random() * Math.pow(10, length))
      .toString()
      .padStart(length, '0');
  }
  
}
