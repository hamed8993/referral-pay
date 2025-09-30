import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './guards/jwt.guard';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalAuthGuard,
    LocalStrategy,
    JwtAuthGuard,
    JwtStrategy,
  ],
  imports: [
    UserModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
      }),
    }),
  ],
})
export class AuthModule {}
