import fs from 'fs';

import pool from '../database/database';
import logger from '../logger/logger';

const migrate = () => {
    fs.readdir('./migrations', (err, files) => {
        if (err) {
            logger.error('error: ' + err);
            return;
        }
        files.forEach(async (value, index) => {
            logger.info(index)
            const query = await pool.query(value);
            logger.info(index + ' done.');
        });
    });
}

export default migrate;