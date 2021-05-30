import fs from 'fs';

import pool from '../database/database';
import logger from '../logger/logger';

const migrate = () => {
    fs.readdir('./migrations', (err, files) => {
        if (err) {
            logger.error('error: ' + err);
            return;
        }
        files.forEach((value, index) => {
            fs.readFile('./migrations/' + value, 'utf-8', (err: any, data: any) => {
                logger.info('\t' + value + '...');
                pool.query(data);
            });
        });
    });
}

export default migrate;