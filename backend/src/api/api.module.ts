import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from '../middleware/logger.middleware';
import { HeaderMiddleware } from '../middleware/header.middleware';
import { LlamaService } from '../llama/llama.service';
import { RagService } from '../rag/rag.service';
import { UuidService } from '../uuid/uuid.service';
import { ChatService } from '../chat/chat.service';

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), HttpModule],
    controllers: [ApiController],
    providers: [ApiService, LlamaService, ChatService, RagService, UuidService],
})
export class ApiModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware, HeaderMiddleware).forRoutes('/');
    }
}
