import { IMetaResponse } from './meta-response.interface';

export interface IApiResponse<T> {
  data: T; //data?.data
  path: string; //request.url
  requestId: string;
  success: true;
  statusCode: number; //context.switchToHttp().getResponse().statusCode
  message: string; //data?.message || "getMessage()",
  meta: IMetaResponse | {};
  timestamp: string;
}

export interface IControllerResponse<T> {
  data: T;
  meta?: IMetaResponse;
  message?: string;
}
