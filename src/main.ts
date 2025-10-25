import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import {
  swaggerConfig,
  swaggerCustomOptions,
  swaggerDocumentOptions,
} from 'swagger.config';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const swaggerDocumentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig, swaggerDocumentOptions);
  // swaggerDocumentFactory.security = [{ authorization: [] }];
  SwaggerModule.setup('api', app, swaggerDocumentFactory, swaggerCustomOptions);

   app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
