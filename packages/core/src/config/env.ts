import 'dotenv/config';
import { bool, cleanEnv, port, str } from 'envalid';

const env = cleanEnv(process.env, {
  NODE_ENV: str(),
  PORT: port(),
  LOG_FORMAT: str({ devDefault: 'dev', choices: ['dev', 'combined'] }),
  LOG_DIR: str({ default: '../logs' }),
  CORS_ORIGIN: str({ devDefault: 'true' }),
  CORS_CREDENTIALS: bool({ devDefault: true }),
});

export default env;
