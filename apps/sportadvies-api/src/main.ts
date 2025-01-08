import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.enableCors({
    origin: ['https://sportcaster-frontend.azurewebsites.net'], // Alleen je frontend toestaan
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const validationErrors = errors.map((err) => ({
          field: err.property,
          errors: Object.values(err.constraints || {}),
        }));
        return new BadRequestException({
          message: 'Validation failed',
          errors: validationErrors,
        });
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Sportadvies API')
    .setDescription('API voor sportadvies gebaseerd op weercondities')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${globalPrefix}/docs`, app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`🚀 Sportadvies API is running on: http://localhost:${port}/${globalPrefix}`);
  Logger.log(`📄 Swagger docs beschikbaar op: http://localhost:${port}/${globalPrefix}/docs`);
}

bootstrap();
