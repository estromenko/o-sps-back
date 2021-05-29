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
import { increaseLikes, decreaseLikes, newEventComment, newFleamarketComment } from './sockets/sockets';


require('dotenv').config();

const app: express.Application = express();

// Middleware
app.use(cors({}))
app.use(helmet());
app.use(compression());
app.disable('x-powered-by');
app.use(bodyParser());
app.use(loggingMiddleware);

app.use('/uploads', express.static('./uploads'));


// Routing
app.use('/auth', auth);
app.use('/events', events);
app.use('/invitations', invitations)
app.use('/fleamarket', fleamarket);
app.use('/petitions', petitions);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {origin: [`http://localhost:${serverConfig.port}`]},
}); 

io.on("connection", async (socket: Socket) => {
    socket.on('new fleamarket comment', await newFleamarketComment(socket));
    socket.on('new event comment', await newEventComment(socket));
    socket.on('increment likes', await increaseLikes(socket));
    socket.on('decrement likes', await decreaseLikes(socket));
    socket.on('warning', (data: any) => {
        socket.emit('warging', data);
    });
});

server.listen(serverConfig.port, () => {
    logger.info(`Server started at localhost:${serverConfig.port}`);
});
