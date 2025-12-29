import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,  // Tự động loại bỏ các field không có trong DTO
    forbidNonWhitelisted: true,  // Nếu request có field không nằm trong DTO → báo lỗi 400
    transform: true,  // Tự động convert plain object → instance của DTO class
    transformOptions: {
      enableImplicitConversion: true // Tự động convert kiểu dữ liệu
    }
  })); // Global Pipes

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
