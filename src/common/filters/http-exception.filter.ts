import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    console.error(exception);
    console.error((exception as any)?.stack || exception);

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let error = 'Internal Server Error';
    let code: string | undefined;

    // NestJS HttpException
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        message = (res as any).message ?? message;
        error = (res as any).error ?? error;
      }
    }

    // Prisma errors
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      status = HttpStatus.CONFLICT;

      if (exception.code === 'P2002') {
        message = 'Unique constraint failed';
        code = 'UNIQUE_CONSTRAINT';
      }

      if (exception.code === 'P2003') {
        message = 'Foreign key constraint failed';
        code = 'FOREIGN_KEY_CONSTRAINT';
      }
    }

    response.status(status).json({
      statusCode: status,
      error,
      message,
      code,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}