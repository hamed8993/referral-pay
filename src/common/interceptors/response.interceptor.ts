import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { IApiResponse } from '../interface/api-response.interface';
import { map } from 'rxjs/operators';
import { timeStamp } from 'node:console';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, IApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IApiResponse<T>> | Promise<Observable<IApiResponse<T>>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const requestId =
      request.headers['x-request-id'] || request.id || this.generateRequestId();
    const statusCode = response.statusCode;
    //....

    return next.handle().pipe(
      map((data) => {
        return {
          data: data.data,
          meta: data?.meta || {},
          message: data?.message || this.getMessage(statusCode),
          success: true,
          statusCode,
          requestId,
          path: request.url,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }

  private getMessage(statusCode: number): string {
    const messages = {
      200: 'Request successful',
      201: 'Resource created successfully',
      202: 'Request accepted',
      204: 'Resource deleted successfully',
    };
    return messages[statusCode] || 'Request successful';
  }

  private generateRequestId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}
