import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const RawHeaders = createParamDecorator(
  (data, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!request) throw new InternalServerErrorException('Request not found');

    const rawHeaders = request.rawHeaders;

    if (!rawHeaders)
      throw new InternalServerErrorException('Headers not found');

    // Convert rawHeaders array to object
    const headers = {};
    for (let i = 0; i < rawHeaders.length; i += 2) {
      headers[rawHeaders[i]] = rawHeaders[i + 1];
    }

    return data ? headers[data] : headers;
  },
);
