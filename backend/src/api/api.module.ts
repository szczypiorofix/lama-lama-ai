import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { OllamaModule } from 'src/services/ollama/ollama.module';
import { RagModule } from 'src/services/rag/rag.module';

import { HeaderMiddleware } from '../middleware/header.middleware';
import { LoggerMiddleware } from '../middleware/logger.middleware';

import { ChatModule } from './chat/chat.module';
import { DataModule } from './data/data.module';
import { ImageModule } from './image/image.module';
import { ModelsModule } from './models/models.module';
import { UtilsModule } from './utils/utils.module';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ScheduleModule.forRoot(),
        ChatModule,
        DataModule,
        ImageModule,
        ModelsModule,
        UtilsModule,
        OllamaModule,
        RagModule,
    ],
    controllers: [ApiController],
    providers: [ApiService],
})
export class ApiModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware, HeaderMiddleware).forRoutes('/');
    }
}
