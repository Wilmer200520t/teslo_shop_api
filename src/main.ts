import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function App() {
  const app = await NestFactory.create(AppModule);
  // Set the global prefix for the API
  app.setGlobalPrefix('api');

  // ValidationPipe for global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger OPEN API documentation
  const config = new DocumentBuilder()
    .setTitle('Teslo Shop API')
    .setDescription('The Teslo Shop API description')
    .setVersion('1.0')
    .addTag('teslo-shop')
    .build();

  const documentFactory = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory, {
    jsonDocumentUrl: 'docs/json',
  });

  // Start the server
  await app.listen(process.env.PORT);

  // Log the server URL
  const logger = new Logger('NestMainApp');
  logger.log(`Server is running on ${await app.getUrl()}`);
}

App();
