import { Router, Response } from 'express';
import { IRequest } from '../interfaces/request';
import authMiddleware from '../middleware/auth';

const user = Router();

user.put(`/edit`, authMiddleware, async (req: IRequest, res: Response) => {
    // TODO
});

export default user;