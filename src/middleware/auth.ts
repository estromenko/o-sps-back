import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../database/database';
import { IRequest } from '../interfaces.ts/request';


const authMiddleware = async (req: IRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    const secret = process.env.JWT_SECRET;
    if (secret === undefined) {
        return res.status(500).json({
            error: 'Error with token config',
        });
    }

    try {
        let payload: any;
        jwt.verify(token!, secret, function(err, decoded) {
            if (err !== null) {
                return null;
            }
            payload = decoded;    
        });

        if (payload == null) {
            return res.status(403).json({
                error: 'Wrong token decoding',
            });
        }
           
        const user = await pool.query(`SELECT * FROM users WHERE id=$1`, [ payload.id ])

        if (user.rows.length < 1) {
            throw new Error('Invalid token')
        }

        req.user = user.rows[0]
        next();

    } catch(err) {
        return res.status(403).json(err);
    }
}

export default authMiddleware;
