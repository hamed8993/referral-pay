import { IPaginationResponse } from "./pagination-response.interface";

export interface IMetaResponse {
  pagination?: IPaginationResponse;
  redirect?: boolean;
  [key: string]: any;
}