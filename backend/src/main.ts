import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = process.env.PORT || 4000;
  const app = await NestFactory.create(AppModule, { cors: true });
  app.enableCors();
  // app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}
bootstrap();
