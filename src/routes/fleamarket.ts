import { Router, Response } from 'express';
import pool from '../database/database';
import { IRequest } from '../interfaces/request';
import authMiddleware from '../middleware/auth';

import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({storage: storageConfig});

const fleamarket = Router();

fleamarket.get(`/`, authMiddleware, async (req: IRequest, res: Response) => {
    const type = req.query.type;
    let posts;

    if (!type) {
        posts = await pool.query(`SELECT * FROM fleamarket_posts`);
    } else {
        posts = await pool.query(`SELECT * FROM fleamarket_posts WHERE type = $1`, [ type ]);
    }

    return res.status(200).json(posts.rows);
});

fleamarket.get(`/:id`, authMiddleware, async (req: IRequest, res: Response) => {
    const id = req.params.id;
    const post = await pool.query(`SELECT * FROM fleamarket_posts WHERE id = $1`, [ id ]);
    if (post.rows.length < 1) {
        return res.status(404).json({
            error: 'not found',
        });
    }
    return res.status(200).json(post.rows);
});

fleamarket.post(`/create`, authMiddleware, upload.single('image'), async (req: IRequest, res: Response) => {
    const post = await pool.query(
        `INSERT INTO fleamarket_posts (id, title, text, owner_id, image, type) 
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
        [ uuidv4(), req.body.title, req.body.text, req.user?.id, req.file.path, req.body.type, ],
    );

    if (post.rows.length < 1) {
        return res.status(400).json({
            error: 'invalid data',
        });
    }

    return res.status(201).json(post.rows[0]);
});

export default fleamarket;