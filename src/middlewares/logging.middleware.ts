import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.info('');
    console.info('*********************************REQUEST START*************************************');
    console.info(`NEW REQUEST ---> ${req.method} ${req.originalUrl}`);
    console.info('req Type=======>', req.method.toUpperCase());
    console.info('req Path=======>', req.path);
    console.info('req Body=======>', req.body);
    console.info('req Params=====>', req.params);
    console.info('req Query======>', req.query);
    console.info('Authorization======>', req.headers.authorization);
    console.info('IP============>', req.headers.ip);
    console.info('deviceType============>', req.headers.devicetype);
    console.info('deviceToken============>', req.headers.devicetoken);
    console.info('deviceId============>', req.headers.deviceid);
    console.info('TIME============>', new Date());
    console.info('********************************REQUEST ENDS******************************************');
    next();
  }
}
