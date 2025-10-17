import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { ICreate } from './interface/create.interface';
import { IFullRegister } from './interface/full-register.interface';
import { generateReferral } from 'src/common/helpers/generate-referral.helper';
import { hashPassword } from 'src/common/helpers/hash-password.helper';
import { EnrollmentStatus } from 'src/common/enums/enrollment.enum';
import { ValidatedJwtUser } from '../auth/interfaces/payload.interface';
import { IUpdateUser } from './interface/update.interface';
import { validatePassword } from 'src/common/helpers/validate-password.helper';

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

  private async _createUserIbternal(user: ICreate, repo: Repository<User>) {
    if (user.referralCode) {
      const parentUserByRefCode = await repo.findOne({
        where: {
          referralCode: user.referralCode,
        },
      });
      if (!parentUserByRefCode)
        throw new BadRequestException(
          'such referral code not exist. try again!',
        );
      return await repo.save({
        email: user.email,
        password: await hashPassword(user.password),
        referralCode: generateReferral(user.email),
        parent: parentUserByRefCode,
      });
    } else {
      return await repo.save({
        email: user.email,
        password: await hashPassword(user.password),
        referralCode: generateReferral(user.email),
      });
    }
  }

  async createUser(user: ICreate): Promise<any> {
    return await this._createUserIbternal(user, this.userRepo);
  }

  async createUserByTransactionManager(
    user: ICreate,
    manager: EntityManager,
  ): Promise<any> {
    return await this._createUserIbternal(user, manager.getRepository(User));
  }

  async fullRegister(
    body: IFullRegister,
    user: ValidatedJwtUser,
  ): Promise<any> {
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

  async updateUser(body: {
    user: ValidatedJwtUser;
    payload: IUpdateUser;
  }): Promise<any> {
    const existUser = await this.userRepo.findOne({
      where: {
        id: body.user.id,
      },
    });
    if (!existUser) throw new BadRequestException('such a user not found!');

    if (body.payload.password) {
      if (
        validatePassword(body.payload.password) &&
        body.payload.password === body.payload.passwordRepeat 
      ) {
        existUser.password = await hashPassword(body.payload.password);
      } else {
        throw new BadRequestException(
          'Password is unCompatible or is not same by repeated password!',
        );
      }
    }
    if (body.payload.profileImgUrl) {
      existUser.profileImgUrl = body.payload.profileImgUrl;
    }
    if (body.payload.firstName || body.payload.lastName) {
      existUser.fullName = body.payload.firstName + ' ' + body.payload.lastName;
    }

    if (
      !body.payload.password &&
      !body.payload.profileImgUrl &&
      !body.payload.firstName &&
      !body.payload.lastName
    )
      return 'you did not updated any thing!';

    return await this.userRepo.save({ ...existUser });
  }
}
