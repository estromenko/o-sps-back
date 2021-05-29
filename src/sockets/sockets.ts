import { Socket } from 'socket.io';
import pool from '../database/database';

const newFleamarketComment = (socket: Socket) => {
    return async (data: any) => {
        const comment = await pool.query(
            `INSERT INTO fleamarket_post_comments (post_id, owner_id, text, is_anonimous) 
            VALUES ($1, $2, $3, $4) RETURNING *;`,
            [ data.eventId, data.ownerId, data.text, data.isAnonimous, ],
        );
        
        if (comment.rows.length < 1) {
            socket.to(socket.id).emit("new event comment", {
                error: 'couldnt create comment',
            });
        } else {
            socket.to(socket.id).emit("new event comment", comment.rows);
        }
    }
}

const newEventComment = (socket: Socket) => {
    return async (data: any) => {
        const comment = await pool.query(
            `INSERT INTO comments (event_id, owner_id, text) VALUES ($1, $2, $3) RETURNING *;`,
            [ data.eventId, data.ownerId, data.text, ],
        );
        
        if (comment.rows.length < 1) {
            socket.to(socket.id).emit("new event comment", {
                error: 'couldnt create comment',
            });
        } else {
            socket.to(socket.id).emit("new event comment", comment.rows);
        }
    }
}

const increaseLikes = (socket: Socket) => {
    return async (data: any) => {
        const likes = await pool.query(`UPDATE petitions SET likes = likes + 1 WHERE id=$1 RETURNING likes`, 
        [ data.id, ]);

        socket.to(socket.id).emit('increase likes', {
            likes: likes.rows[0].likes,
        });
    }
}

const decreaseLikes = (socket: Socket) => {
    return async (data: any) => {
        const likes = await pool.query(`UPDATE petitions SET likes = likes - 1 WHERE id=$1 RETURNING likes`, 
        [ data.id, ]);

        socket.to(socket.id).emit('decrease likes', {
            likes: likes.rows[0].likes,
        });
    }
}

export {
    newFleamarketComment,
    newEventComment,
    increaseLikes,
    decreaseLikes,
}
