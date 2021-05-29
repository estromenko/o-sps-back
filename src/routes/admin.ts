import { Response, Router } from 'express';
import pool from '../database/database';
import { IRequest } from '../interfaces/request';
import adminMiddleware from '../middleware/admin';

const admin = Router();

admin.all(`/fleamarket/:id`, adminMiddleware, async (req: IRequest, res: Response) => {
    if (req.method == 'DELETE') {
        const result = await pool.query(`DELETE FROM fleamarket_posts WHERE id = $1`, [ req.params.id, ]);
        return res.status(200).json({
            ok: 'fleamarket post successfully delteted',
        });
    } else if (req.method == 'PUT') {
        const post = await pool.query(
            `SELECT * FROM fleamarket_posts WHERE id = $1`, 
            [ req.params.id ],
        );

        if (post.rows.length < 1) {
            return res.status(404).json({
                error: 'not found',
            });
        }
        return res.status(200).json(post.rows);
    } else {
        return res.status(405).json({
            error: 'wrong request method',
        });
    }
});

export default admin;
