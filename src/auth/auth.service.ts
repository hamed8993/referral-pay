import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { verifyPassword } from 'src/common/helpers/hash-password.helper';
import { ICreate } from 'src/user/interface/create.interface';
import { IFullRegister } from 'src/user/interface/full-register.interface';
import { UserService } from 'src/user/user.service';
import {
  AuthJwtPayload,
  ValidatedLoginReq,
  ValidatedJwtUser,
} from './interfaces/payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

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

  async validateLocalUser(
    email: string,
    password: string,
  ): Promise<ValidatedLoginReq> {
    const existUser = await this.userService.findOneByEmail(email);
    if (!existUser) throw new UnauthorizedException('Such a user not found!');
    const isPasswordValid = await verifyPassword(password, existUser.password);

    if (!isPasswordValid)
      throw new UnauthorizedException('invalid credentials');

    return {
      id: existUser.id,
      email: existUser.email,
      role:existUser.role
    };
  }

  async generateTokensForLogin(id: number, email: string) {
    const payload: AuthJwtPayload = { sub: id, email };
    const accessToken = await this.jwtService.signAsync(payload);
    return accessToken;
  }

  async signIn(id: number, email: string) {
    const accessToken = await this.generateTokensForLogin(id, email);
    return accessToken;
  }

  async validateJwtUser(userId: number): Promise<ValidatedJwtUser> {
    const user = await this.userService.findOneById(userId);
    if (!user) throw new UnauthorizedException('User Not Found!');
    const currentUser = {
      id: user.id,
      email:user.email,
      role: user.role,
    };
    return currentUser;
  }
}
