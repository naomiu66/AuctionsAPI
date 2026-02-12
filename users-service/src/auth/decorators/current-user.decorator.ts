import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import 'express-session';

export const SessionUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();
    return req.session.userId;
  },
);
