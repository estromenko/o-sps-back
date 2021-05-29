
import { IRequest } from "../interfaces/request";
import authMiddleware from "../middleware/auth";
import { Router, Response } from 'express';
import pool from "../database/database";
import Petition from "../models/petition";

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
        (owner_id, title, text, likes, dislikes)
        VALUES
        ($1, $2, $3, $4, $5) RETURNING id`,
        [ petition.ownerId, petition.title, petition.text, 0, 0 ]
    );

    if (id.rows.length < 1) {
        return res.status(400).json({
            error: 'cannot create petition',
        });
    }

    petition.id = id.rows[0].id;

    return res.status(201).json(petition)
});