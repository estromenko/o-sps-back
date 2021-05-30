import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import { serverConfig } from './config/config';
import logger from './logger/logger';
import helmet from 'helmet';
import compression from 'compression';

import auth from './routes/auth';
import bodyParser from 'body-parser';
import events from './routes/events';
import invitations from './routes/invitations';
import fleamarket from './routes/fleamarket';
import petitions from './routes/petitions';
import loggingMiddleware from './middleware/logging';
import { newEventComment, newFleamarketComment } from './sockets/sockets';
import admin from './routes/admin';
import bath from './routes/bath';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../docs/swagger.json';


import migrate from './utils/migrate';

migrate();

require('dotenv').config();

const app: express.Application = express();

// Middleware
app.use(cors({origin: `*`}));
app.use(helmet());
app.use(compression());
app.disable('x-powered-by');
app.use(bodyParser());
app.use(cookieParser());
app.use('/uploads', express.static('./uploads'));
app.use('/docs', swaggerUi.serve);

app.use(loggingMiddleware);


// Routing
app.get('/docs', swaggerUi.setup(swaggerDocument));
app.use('/auth', auth);
app.use('/events', events);
app.use('/invitations', invitations)
app.use('/fleamarket', fleamarket);
app.use('/petitions', petitions);
app.use('/admin', admin);
app.use('/bath', bath);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {origin: `*`},
}); 

io.on("connection", async (socket: Socket) => {
    socket.on('new fleamarket comment', await newFleamarketComment(socket));
    socket.on('new event comment', await newEventComment(socket));
    socket.on('warning', (data: any) => {
        socket.broadcast.emit('on warning', data);   
    });
});

server.listen(serverConfig.port, () => {
    logger.info(`Server started at localhost:${serverConfig.port}`);
});
