import { Router, Response } from 'express';
import pool from '../database/database';
import { IRequest } from '../interfaces/request';
import authMiddleware from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';
import transporter from '../email/email';

const invitations = Router();


invitations.post(`/create`, authMiddleware, async (req: IRequest, res: Response) => {
    const existant = await pool.query(`SELECT * FROM invitations WHERE email = $1`, [ req.body.email ]);
    if (existant.rows.length > 0) {
        return res.status(400).json({
            error: 'invitations with such email already exists',
        });
    }

    const invitation = await pool.query(`INSERT INTO invitations (id, email) VALUES ($1, $2) RETURNING *;`, 
    [ uuidv4(), req.body.email ]);

    // const result = await transporter.sendMail({
    //     from: 'CWuS',
    //     subject: 'Invitation',
    //     to: invitation.rows[0].email,
    //     text: "Invitation",
    // });

    return res.status(201).json(invitation.rows[0]);
});

invitations.get(`/`, authMiddleware, async (req: IRequest, res: Response) => {
    const invites = await pool.query(`SELECT * FROM invitations;`);
    return res.status(200).json(invites.rows);
});


export default invitations;