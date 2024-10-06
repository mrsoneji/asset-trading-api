import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  // Enable Swagger according enviroment, disable it only in production
  const environment = process.env.NODE_ENV || 'local';
  if (environment === 'development' || environment === 'local') {
    const config = new DocumentBuilder()
      .setTitle('asset-trading-api')
      .setDescription(
        'This API facilitates the search for investment assets based on user-defined criteria such as ticker symbols or asset names. It returns a list of similar assets, enabling users to make informed investment decisions quickly.',
      )
      .addBearerAuth()
      .addSecurityRequirements('bearer')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document); // Swagger will be available at /api
  }

  await app.listen(3000);
}
bootstrap();
