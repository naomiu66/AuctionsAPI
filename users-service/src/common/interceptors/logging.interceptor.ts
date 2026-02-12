import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Response, Request } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest<Request>();
    const { method, url } = req;
    const now = Date.now();

    const res = context.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      tap(() => {
        this.logger.log(
          `${method} ${url} ${res.statusCode} - ${Date.now() - now}ms`,
        );
      }),
      catchError((err: Error) => {
        const status = err instanceof HttpException ? err.getStatus() : 500;
        this.logger.log(`${method} ${url} ${status} - ${Date.now() - now}ms`);
        return throwError(() => err);
      }),
    );
  }
}
