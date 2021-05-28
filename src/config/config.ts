import winston from "winston";
import pg from 'pg';

require('dotenv').config();


const serverConfig = {
    port: parseInt(process.env.PORT || '3000'),
};

const loggerConfig: winston.LoggerOptions = {
    transports: [
        new winston.transports.Console({
            format: winston.format.cli(),
        }),
    ],
};

const databaseConfig: pg.PoolConfig = {
    host: process.env.PG_HOST || 'localhost',
    port: parseInt(process.env.PG_PORT || '5432'),
    database: process.env.PG_DB || 'postgres',
    user: process.env.PG_USER || 'postgres',
    password: process.env.PG_PASSWORD || '1234',
};

export {
    serverConfig,
    loggerConfig,
    databaseConfig,
};