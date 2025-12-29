import { registerAs } from '@nestjs/config';

// Custom Config File with Namespace
export default registerAs('database', () => ({
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  syncronize: process.env.DB_SYNC === 'true' ? true : false,
  autoloadEntities: process.env.AUTO_LOAD === 'true' ? true : false,
}));
