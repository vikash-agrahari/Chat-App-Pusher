import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import * as express from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/exceptionFilter';
import { LoggerMiddleware } from './middlewares/logging.middleware';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Swagger } from './common/constant';
import { IoAdapter } from '@nestjs/platform-socket.io';


async function bootstrap() {
  // Create the NestJS application
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks(); // Enable shutdown hooks to gracefully handle shutdown

  // Use express middleware to parse JSON requests and store the raw request body
  app.use(
    express.json({
      verify: (req: any, res, buf) => {
        req.rawBody = buf;
      },
    }),
  );

  // Use global validation pipe for automatic input validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.enableCors();
  // Use custom logger middleware and set up Winston logger
  app.use(new LoggerMiddleware().use);
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // Get the HTTP adapter to use in global exception filters
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  // Get the configuration service to retrieve environment variables
  const configService = app.get(ConfigService);

  // Retrieve the HTTP port from the configuration or use a default value
  const nestPort: number = configService.get<number>('PORT') || 8001;

  const config = new DocumentBuilder()
    .setTitle(Swagger.Title)
    .setDescription(Swagger.Description)
    .setVersion(Swagger.Version)
    .addApiKey(
      {
        type: 'apiKey',
        name: Swagger.AddApiKey.Name,
        in: Swagger.AddApiKey.In,
      },
      Swagger.AuthType,
    )
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(Swagger.Path, app, document);

  // Start the NestJS application
  await app.listen(nestPort);
  console.info(`Nest server listening on Port: ${nestPort}`);
  console.info(`Swagger: http://localhost:${nestPort}/swagger#/`);
}

// Call the bootstrap function to start the application
bootstrap();
