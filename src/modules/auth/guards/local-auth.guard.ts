import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StrategyNameEnum } from '../enums/auth.enum';

@Injectable()
export class LocalAuthGuard extends AuthGuard(
  StrategyNameEnum.LOCAL_STRATEGY,
) {}
