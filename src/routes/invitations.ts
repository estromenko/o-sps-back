import { Router, Response } from 'express';
import pool from '../database/database';
import { IRequest } from '../interfaces/request';
import authMiddleware from '../middleware/auth';

const invitations = Router();


invitations.post(`/create`, authMiddleware, async (req: IRequest, res: Response) => {
    const existant = await pool.query(`SELECT * FROM invitations WHERE email = $1`, [ req.body.email ]);
    if (existant.rows.length > 0) {
        return res.status(400).json({
            error: 'invitations with such email already exists',
        });
    }

    const invitation = await pool.query(`INSERT INTO invitations (email) VALUES ($1) RETURNING *;`, [ req.body.email ]);
    return res.status(201).json(invitation.rows[0]);
});


export default invitations;