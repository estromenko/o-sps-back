import { Request, Response, Router } from 'express';
import Invitation from '../models/invitation';
import User from '../models/user';

import { getInvitationById } from '../repository/invitation';
import { register, validate, login } from '../services/user';

const auth = Router();

auth.post(`/reg`, async (req: Request, res: Response) => { 
    const invitation: Invitation = await getInvitationById(req.body.invitationId);
    if (invitation == null) {
        return res.status(400).json({
            'error': `no invitation with id ${req.body.invitationId}`,
        });
    }
    
    const _user: User = {
        email: invitation.email,
        dormId: parseInt(req.body.dormId),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        roomNumber: parseInt(req.body.roomNumber),
    };

    const errors = validate(_user);
    if (errors !== null) {
       return res.status(400).json(errors);
    }

    const result = await register(_user);
    if (result.error === null) {
        return res.status(201).json(result);
    }
    return res.status(400).json(result);
});

auth.post(`/login`, async (req: Request, res: Response) => {
    const result = await login(req.body.email, req.body.password);
    if (result.error === null) {
        return res.status(201).json(result);
    }
    return res.status(400).json(result);
});


export default auth;