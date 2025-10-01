import { RoleEnum } from 'src/common/enums/role.enum';

export interface AuthJwtPayload {
  sub: number;
  email: string;
}

export interface AuthJwtGeneratedPayload {
  sub: number;
  email: string;
  iat?: number;
  exp?: number;
}

export interface ValidatedLoginReq {
  id: number;
  email: string;
  role: RoleEnum;
}

export interface ValidatedJwtUser {
  id: number;
  email: string;
  role: RoleEnum;
}
