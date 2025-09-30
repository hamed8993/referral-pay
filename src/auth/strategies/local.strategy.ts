import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Injectable } from '@nestjs/common';
import { StrategyNameEnum } from '../enums/auth.enum';

@Injectable()
export class LocalStrategy extends PassportStrategy(
  Strategy,
  StrategyNameEnum.LOCAL_STRATEGY,
) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<unknown> {
    return await this.authService.validateLocalUser(email, password);
  }
}
