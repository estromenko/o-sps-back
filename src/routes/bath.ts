import { Response, Router } from 'express';
import pool from '../database/database';
import { IRequest } from '../interfaces/request';
import authMiddleware from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';

const bath = Router();

bath.post(`/create`, authMiddleware, async (req: IRequest, res: Response) => {
    const _bath = await pool.query(
        `INSERT INTO bath_queue (id, user_id, start_time)
        VALUES ($1, $2, $3) RETURNING *;`,
        [ uuidv4(), req.user?.id, new Date().toISOString() ]
    );
    if (_bath.rows.length < 1) {
        return res.status(400).json({
            error: 'cannot create add user into queue',
        });
    }
    return res.status(201).json(_bath.rows[0]);
});

bath.get(`/`, authMiddleware, async (req: IRequest, res: Response) => {
    const bathes = await pool.query(`SELECT * FROM bath_queue`);
    return res.status(200).json(bathes.rows);
});

export default bath;