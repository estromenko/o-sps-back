import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import { serverConfig } from './config/config';
import pool from './database/database';
import logger from './logger/logger';
import helmet from 'helmet';
import compression from 'compression';

import auth from './routes/auth';
import bodyParser from 'body-parser';

require('dotenv').config();


const app: express.Application = express();

// Middleware
app.use(cors({}))
app.use(helmet());
app.use(compression());
app.disable('x-powered-by');
app.use(bodyParser());

// Routing
app.use('/auth', auth)

const server = http.createServer(app);
const io = new Server(server, {
    cors: {origin: [`http://localhost:${serverConfig.port}`]},
}); 

server.listen(serverConfig.port, () => {
    logger.info(`Server started at localhost:${serverConfig.port}`);
});
