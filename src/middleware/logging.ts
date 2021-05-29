import { Request, Response, NextFunction } from 'express';
import logger from '../logger/logger';

const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
    next();
    logger.info(req.path + ', ' + req.method + ', ' + res.statusCode);
}

export default loggingMiddleware;