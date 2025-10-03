import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { ICreate } from './interface/create.interface';
import { IFullRegister } from './interface/full-register.interface';
import { generateReferral } from 'src/common/helpers/generate-referral.helper';
import { hashPassword } from 'src/common/helpers/hash-password.helper';
import { EnrollmentStatus } from 'src/common/enums/enrollment.enum';
import { ValidatedJwtUser } from '../auth/interfaces/payload.interface';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async findOneByEmail(email: string): Promise<any> {
    return await this.userRepo.findOne({
      where: {
        email,
      },
    });
  }

  async findOneById(id: number): Promise<any> {
    return await this.userRepo.findOne({
      where: {
        id,
      },
    });
  }

  async createUser(user: ICreate): Promise<any> {
    if (user.referralCode) {
      const parentUserByRefCode = await this.userRepo.findOne({
        where: {
          referralCode: user.referralCode,
        },
      });
      if (!parentUserByRefCode)
        throw new BadRequestException(
          'such referral code not exist. try again!',
        );
      return await this.userRepo.save({
        email: user.email,
        password: await hashPassword(user.password),
        referralCode: generateReferral(user.email),
        parent: parentUserByRefCode,
      });
    } else {
      return await this.userRepo.save({
        email: user.email,
        password: await hashPassword(user.password),
        referralCode: generateReferral(user.email),
      });
    }
  }

  async fullRegister(body: IFullRegister,user:ValidatedJwtUser): Promise<any> {
    const userByEmail = await this.findOneByEmail(user.email);
    if (!userByEmail) throw new BadRequestException('User not found');
    return await this.userRepo.update(
      { email: user.email },
      {
        fullName: body.firstName + ' ' + body.lastName,
        enrollment: EnrollmentStatus.FULLY,
      },
    );
  }
}
