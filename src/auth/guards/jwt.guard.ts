import { AuthGuard } from '@nestjs/passport';
import { StrategyNameEnum } from '../enums/auth.enum';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard(StrategyNameEnum.JWT_STRATEGY) {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isRoutePublic = this.reflector.get(PUBLIC_KEY, context.getHandler());
    return isRoutePublic || super.canActivate(context);
  }
}
