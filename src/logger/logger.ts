import winston from 'winston';

import { loggerConfig } from '../config/config';

const logger = winston.createLogger(loggerConfig);

export default logger;