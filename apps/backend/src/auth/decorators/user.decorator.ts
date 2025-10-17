import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUserResponse } from '../interfaces/user.interface';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IUserResponse => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);