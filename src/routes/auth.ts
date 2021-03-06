import { Request, Response, Router } from 'express';
import { IRequest } from '../interfaces/request';
import authMiddleware from '../middleware/auth';
import Invitation from '../models/invitation';
import User from '../models/user';

import { getInvitationById } from '../repository/invitation';
import { register, validate, login } from '../services/user';


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



const auth = Router();

auth.post(`/reg`, upload.single('image'), async (req: Request, res: Response) => { 
    const invitation: Invitation = await getInvitationById(req.body.invitationId);
    if (invitation == null) {
        return res.status(400).json({
            'error': `no invitation with id ${req.body.invitationId}`,
        });
    }
    
    const _user: User = {
        email: invitation.email,
        dormId: req.body.dormId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        roomNumber: parseInt(req.body.roomNumber),
        image: req.file?.path || 'default.jpeg',
    };

    const errors = validate(_user);
    if (errors !== null) {
       return res.status(400).json(errors);
    }

    const result = await register(_user);
    if (result.error === null) {
        res.cookie('token', result.token, {httpOnly: true})

        delete result.user.password;
        const data = {
            'user': result.user,
            'error': result.error,
        }
        return res.status(201).json(data);
    }
    
    const data = {
        user: result.user,
        error: result.error,
    }

    return res.status(400).json(data);
});

auth.post(`/login`, async (req: Request, res: Response) => {
    let result = await login(req.body.email, req.body.password);
    if (result.error === null) {
        res.cookie('token', result.token, {httpOnly: true})
        delete result.user.password;
        const data = {
            'user': result.user,
            'error': result.error,
        }
        return res.status(201).json(data);
    }

    const data = {
        'user': result.user,
        'error': result.error,
    }

    return res.status(400).json(data);
});


auth.get(`/me`, authMiddleware, async (req: IRequest, res: Response) => {
    delete req.user?.password;
    return res.status(200).json(req.user);
});

auth.post(`/logout`, authMiddleware, async (req: IRequest, res: Response) => {
    delete req.cookies.token;
    return res.status(200).json({
        success: 'successfully deleted',
    });
});

export default auth;

