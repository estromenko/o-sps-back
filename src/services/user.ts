import Ajv from "ajv";
import User from "../models/user";
import pool from "../database/database";
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
const ajv = new Ajv();

require('dotenv').config();

const schema = {
    type: "object",
    properties: {
        firstName: {type: "string"},
        lastName: {type: "string"},
        password: {type: "string"},
    },
    required: [
        'firstName', 'lastName', 'password', 
    ],
};

const validate = (user: User) => {
    const validator = ajv.compile(schema);
    const isValid = validator(user);
    if (!isValid) {
        return validator.errors;
    }
    return null;
};

const register = async (user: User) => {
    const existantUser = await pool.query(`SELECT * FROM users WHERE email=$1`, [user.email]);

    if (existantUser.rows.length > 0) {
        return {
            user: null,
            error: 'User with such email already exists',
        }
    }

    user.password = await argon2.hash(user.password!);

    const id = await pool.query(`
        INSERT INTO users 
        (id, email, first_name, last_name, password, dorm_id, room_number)
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id;
    `, [uuidv4(), user.email, user.firstName, user.lastName, user.password, user.dormId || null, user.roomNumber || null]);

    if (id.rows.length < 1) {
        return {
            user: null,
            error: 'Error creating user',
        };
    }

    user.id = id.rows[0].id;

    const token = createToken({
        id: user.id,
    });

    return {
        token,
        user: user,
        error: null,
    };
}

const login = async (email: string, password: string) => {
    const user = await pool.query(`SELECT * FROM users WHERE email=$1`, [email]);
    if (user.rows.length < 1) {
        return {
            user: null,
            error: 'Wrong email or password',
        }
    }

    const pass = user.rows[0].password;

    const ok = await argon2.verify(pass, password);
    if (!ok) {
        return {
            user: null,
            error: 'Wrong email or password',
        }
    }

    const token = createToken({
        id: user.rows[0].id,
    });

    return {
        token: token,
        user: user.rows[0],
        error: null,
    }
}

const createToken = (payload: any) => {
    const secret = process.env.JWT_SECRET;
    if (secret === undefined) {
        return null;
    }
    const token = jwt.sign(payload, secret);
    return token;
}

const compare = async (hash: string, pass: string) => {
    return await argon2.verify(hash, pass);
}

export {
    validate,
    register,
    createToken,
    login,
    compare,
};
