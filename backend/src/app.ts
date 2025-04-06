import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api/api.module';
import { API_VERSION } from './shared/constants';
import { ValidationPipe } from '@nestjs/common';

const PORT: string | number = process.env.PORT ?? 3000;

async function bootstrap() {
    const app = await NestFactory.create(ApiModule);
    app.setGlobalPrefix(API_VERSION);
    app.useGlobalPipes(new ValidationPipe());
    app.enableCors();
    await app.listen(PORT);
}
bootstrap()
    .then(() => console.log('Nest application started at port ' + PORT))
    .catch((err) => console.log(err));
