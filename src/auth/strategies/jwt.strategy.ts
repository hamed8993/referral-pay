import { PassportStrategy } from '@nestjs/passport';
import { StrategyNameEnum } from '../enums/auth.enum';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { Injectable } from '@nestjs/common';
import {
  AuthJwtGeneratedPayload,
  AuthJwtPayload,
} from '../interfaces/payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  StrategyNameEnum.JWT_STRATEGY,
) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET as string,
      ignoreExpiration: true,
    });
  }

  async validate(payload: AuthJwtGeneratedPayload): Promise<any> {
    const id = payload.sub;
    return await this.authService.validateJwtUser(id);
  }
}
