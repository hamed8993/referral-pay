import { AuthGuard } from '@nestjs/passport';
import { StrategyNameEnum } from '../enums/auth.enum';

export class JwtAuthGuard extends AuthGuard(StrategyNameEnum.JWT_STRATEGY) {}
