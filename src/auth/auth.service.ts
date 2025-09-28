import { BadRequestException, Injectable } from '@nestjs/common';
import { ICreate } from 'src/user/interface/create.interface';
import { IFullRegister } from 'src/user/interface/full-register.interface';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async signUp(body: ICreate): Promise<any> {
    const existUserAllready = await this.userService.findOneByEmail(body.email);
    if (existUserAllready)
      throw new BadRequestException('user allready exist!');
    return await this.userService.createUser(body);
  }

  async fullRegister(body: IFullRegister): Promise<any> {
    const userByEmail = await this.userService.findOneByEmail(body.email);
    if (!userByEmail) throw new BadRequestException('User not found');
    return await this.userService.fullRegisterUser(body);
  }
}
