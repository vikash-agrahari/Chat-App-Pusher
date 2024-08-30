import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { RESPONSE_MSG } from 'src/common/responses';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    let errorMessage = RESPONSE_MSG.ERROR;

    if (exception.details) {
      // gRPC error handling
      errorMessage = exception.details;
    } else if (exception.response) {
      errorMessage = Array.isArray(exception.response.message)
        ? exception.response.message[0]
        : exception.response.message;
    }

    const responseBody = {
      status: httpStatus,
      success: false,
      error: errorMessage,
      message: errorMessage,
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      timestamp: new Date().toISOString(),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);

    console.log('');
    console.log('*********************************RESPONSE ERROR START*************************************');
    console.log('path=======>', responseBody.path);
    console.log('status=======>', responseBody.status);
    console.log('error=======>', JSON.stringify(responseBody.error));
    console.log('message=======>', JSON.stringify(responseBody.message));
    console.log('TIME============>', new Date());
    console.log('Response Time=======>', new Date().getTime() - ctx.getRequest()?.startTime?.getTime(), 'MS');
    console.log('********************************RESPONSE ERROR ENDS******************************************');
  }
}
