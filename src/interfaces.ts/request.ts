import User from "../models/user";
import { Request } from 'express';

export interface IRequest extends Request {
    user?: User;
};