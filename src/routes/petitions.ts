
import { IRequest } from "../interfaces/request";
import authMiddleware from "../middleware/auth";
import { Router, Response } from 'express';
import pool from "../database/database";
import Petition from "../models/petition";
import { v4 as uuidv4 } from 'uuid';
const petitions = Router();

petitions.get(`/`, authMiddleware, async (req: IRequest, res: Response) => {
    const _petitions = await pool.query(`SELECT * FROM petitions;`);
    return res.status(200).json(_petitions.rows);
});

petitions.post(`/create`, authMiddleware, async (req: IRequest, res: Response) => {
    const petition: Petition = {
        ownerId: req.user?.id,
        title: req.body.title,
        text: req.body.text,
        likes: 0,
        dislikes: 0,
    };

    const id = await pool.query(
        `INSERT INTO petitions
        (id, owner_id, title, text, likes, dislikes)
        VALUES
        ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [ uuidv4(), petition.ownerId, petition.title, petition.text, 0, 0 ]
    );

    if (id.rows.length < 1) {
        return res.status(400).json({
            error: 'cannot create petition',
        });
    }

    petition.id = id.rows[0].id;

    return res.status(201).json(petition)
});

petitions.get(`/:id`, authMiddleware, async (req: IRequest, res: Response) => {
    const _petitions = await pool.query(`SELECT * FROM petitions WHERE id = $1`, [ req.params.id ]);
    if (_petitions.rows.length < 1) {
        return res.status(404).json({
            error: 'not found',
        });
    }
    return res.status(200).json(_petitions.rows[0]);
}); 


export default petitions;
