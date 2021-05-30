import { Router, Response } from 'express';
import { IRequest } from '../interfaces/request';
import authMiddleware from '../middleware/auth';
import pool from '../database/database';
import argon2 from 'argon2';


import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/user';
import { compare } from '../services/user';

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({storage: storageConfig});

const user = Router();

user.put(`/edit`, authMiddleware, upload.single('image'), async (req: IRequest, res: Response) => {
    const updated: User = {
        image: req.file.path || req.user?.image,
        firstName: req.body.firstName || req.user?.firstName,
        lastName: req.body.lastName || req.user?.lastName,
        dormId: req.body.dormId || req.user?.dormId,
        roomNumber: req.body.roomNumber || req.user?.roomNumber,
    };

    try {
        const result = await pool.query(
            `UPDATE users SET 
            image = $1,
            first_name = $2,
            last_name = $3,
            dorm_id = $4,
            room_number = $5 WHERE id = '${req.user?.id}'
            RETURNING *`,
            [ updated.image, updated.firstName, updated.lastName, updated.dormId, updated.roomNumber ],
        );

        return res.status(200).json(result.rows[0]);
    } catch (e) {
        return res.status(400).json({
            error: e,
        });
    }
});

user.put(`/pass`, authMiddleware, async (req: IRequest, res: Response) => {
    const pass = req.body.password;
    const hash = await argon2.hash(pass);

    const result = await pool.query(`UPDATE users SET password = $1 WHERE id = $2`, [ hash, req.user?.id ]);
    return res.status(200).json({
        success: 'password changed successfully',
    });
});

export default user;