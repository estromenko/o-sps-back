import pg from 'pg';

import { databaseConfig } from '../config/config';

const pool = new pg.Pool(databaseConfig);

export default pool;