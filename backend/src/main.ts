import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = process.env.PORT || 4000;
  const app = await NestFactory.create(AppModule, { cors: true });
  // Настройка CORS
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, 
  });

  // app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}
bootstrap();
