import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

function requestDetailsFormat(req: Request): string {
    const requestBody: string = req.body ? JSON.stringify(req.body) : '';
    return `Request: ${req.method} ${req.originalUrl} ${requestBody}`;
}

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, _: Response, next: NextFunction) {
        console.info(requestDetailsFormat(req));
        next();
    }
}
