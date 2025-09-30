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

export interface LoginReturnedRequest {
  email: string;
  id: number;
}
