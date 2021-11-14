import { cleanEnv, port, str } from 'envalid';

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
    LOG_FORMAT: str({ devDefault: 'dev' }),
    LOG_DIR: str({ default: '../logs' }),
    CORS_ORIGIN: str({ devDefault: 'true' }),
    CORS_CREDENTIALS: str({ devDefault: 'true' }),
  });
};

export default validateEnv;
