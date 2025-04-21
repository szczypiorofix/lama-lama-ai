import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from '../middleware/logger.middleware';
import { HeaderMiddleware } from '../middleware/header.middleware';
import { ChatModule } from './chat/chat.module';
import { LlamaModule } from '../llama/llama.module';
import { RagModule } from '../rag/rag.module';
import { DataModule } from './data/data.module';
import { ImageModule } from './image/image.module';
import { ModelsModule } from './models/models.module';
import { UtilsModule } from './utils/utils.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        ChatModule,
        DataModule,
        ImageModule,
        ModelsModule,
        UtilsModule,
        LlamaModule,
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
