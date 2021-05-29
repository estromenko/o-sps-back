import { Response, NextFunction } from 'express';
import { IRequest } from '../interfaces/request';



const adminMiddleware = (req: IRequest, res: Response, next: NextFunction) => {
    if (!req.user?.isAdmin) {
        return res.status(403).json({
            error: 'not admin user',
        });
    }

    next();
}

export default adminMiddleware;