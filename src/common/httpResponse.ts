import { RESPONSE_MSG } from './responses';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';

export class HttpResponse {
  // constructor() {}

  /** response from the server */
  async sendResponse(res: any, b: any = { statusCode: HttpStatus.BAD_REQUEST }, data: any = {}) {
    if (b.statusCode.toString().startsWith('2')) {
      b.data = data;
      res.status(b.statusCode).json(b);
    } else {
      res.status(b.statusCode).json({
        status: b.statusCode,
        success: false,
        error: data.message ? data.message : RESPONSE_MSG.ERROR,
        message: b.message ? b.message : RESPONSE_MSG.ERROR,
        path: res.req.originalUrl,
        timestamp: new Date().toISOString(),
      });
    }
    console.log('');
    console.log('*********************************RESPONSE SUCCESS START*************************************');
    console.log('path================>', res.req.originalUrl);
    console.log('type================>', res.req.method.toUpperCase());
    console.log('status==============>', b.statusCode);
    console.log('TIME================>', new Date());
    console.log('Response Time=======>', new Date().getTime() - res.req?.startTime?.getTime(), 'MS');
    console.log('********************************RESPONSE SUCCESS ENDS******************************************');
  }
}
