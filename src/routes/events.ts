import { Router, Response } from 'express';
import { IRequest } from '../interfaces/request';
import authMiddleware from '../middleware/auth';
import pool from '../database/database';
import Event from '../models/event';

import { v4 as uuidv4 } from 'uuid';

const events = Router();

events.get(`/`, authMiddleware, async (req: IRequest, res: Response) => {
    let speciality = req.query.speciality;
    let _events: any;
    if (!speciality) {
        _events = await pool.query(`SELECT * FROM events`);
    } else {
        _events = await pool.query(`SELECT * FROM events WHERE speciality = $1`, [ speciality ]);
    }

    return res.status(200).json(_events.rows);
});

events.get(`/:id`, authMiddleware, async (req: IRequest, res: Response) => {
    const events = await pool.query(`SELECT * FROM events WHERE id = $1`, [ req.params.id ]);
    if (events.rows.length < 1) {
        return res.status(404).json({
            error: 'not found',
        });
    }

    return res.status(200).json(events.rows[0]);
});

events.get(`/:id/comments`, authMiddleware, async (req: IRequest, res: Response) => {
    const comments = await pool.query(`SELECT * FROM comments WHERE event_id = $1`, [ req.params.id ]);
    return res.status(200).json(comments.rows);
});

events.get(`/:id/comments/create`, authMiddleware, async (req: IRequest, res: Response) => {
    const comments = await pool.query(
        `INSERT INTO comments (id, event_id, owner_id, text) VALUES ($1, $2, $3, $4) RETURNING *;`,
        [ uuidv4(), req.params.id, req.user?.id, req.body.text, ],
    );
    return res.status(200).json(comments.rows);
});

events.post(`/create`, authMiddleware, async (req: IRequest, res: Response) => {
    const event: Event = {
        ownerId: req.user?.id,
        title: req.body.title,
        text: req.body.text,
        speciality: req.body.speciality,
    };

    const id = await pool.query(
        `INSERT INTO events (id, owner_id, title, text, speciality) VALUES ($1, $2, $3, $4, $5 RETURNING id`, 
        [ uuidv4(), event.ownerId, event.title, event.text, event.speciality ],
    );
    
    event.id = id.rows[0].id;
    return res.status(201).json(event);
});

export default events;