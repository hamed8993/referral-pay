import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { verifyPassword } from 'src/common/helpers/hash-password.helper';
import { ICreate } from 'src/modules/user/interface/create.interface';
import { UserService } from 'src/modules/user/user.service';
import {
  AuthJwtPayload,
  ValidatedLoginReq,
  ValidatedJwtUser,
} from './interfaces/payload.interface';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { User } from '../user/entity/user.entity';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private dataSource: DataSource,
    private walletService: WalletService,
  ) {}

  async signUp(body: ICreate): Promise<any> {
    if (body.password !== body.passwordRepeat)
      throw new BadRequestException(
        'password and repeated password are not equal!',
      );
    const existUserAllready = await this.userService.findOneByEmail(body.email);
    if (existUserAllready)
      throw new BadRequestException('user allready exist!');

    const res = await this.dataSource.transaction(async (manager) => {
      const createdUser = await this.userService.createUserByTransactionManager(
        body,
        manager,
      );
      const walletsList = await this.walletService.autoCreateSystemWallet(
        createdUser,
        manager,
      );

      return {
        walletsList,
      };
    });
    return res;
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
      role: existUser.role,
    };
  }

  private async _generateTokensForLogin(id: number, email: string) {
    const payload: AuthJwtPayload = { sub: id, email };
    const accessToken = await this.jwtService.signAsync(payload);
    return accessToken;
  }

  async signIn(id: number, email: string): Promise<string> {
    const accessToken = await this._generateTokensForLogin(id, email);
    return accessToken;
  }

  async validateJwtUser(userId: number): Promise<ValidatedJwtUser> {
    const user = await this.userService.findOneById(userId);
    if (!user) throw new UnauthorizedException('User Not Found!');
    const currentUser = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    return currentUser;
  }
}
