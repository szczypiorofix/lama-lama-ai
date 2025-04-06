import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class HeaderMiddleware implements NestMiddleware {
    use(_: Request, res: Response, next: NextFunction) {
        res.header('Content-Type', 'application/json');
        next();
    }
}
