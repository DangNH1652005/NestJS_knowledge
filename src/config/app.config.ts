import { registerAs } from '@nestjs/config';

export default registerAs('appConfig', () => ({
  port: Number(process.env.PORT) || 3000,

  enviroment: process.env.NODE_ENV || 'production',
}));
