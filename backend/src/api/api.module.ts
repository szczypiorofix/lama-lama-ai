import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from '../middleware/logger.middleware';
import { HeaderMiddleware } from '../middleware/header.middleware';
import { RagService } from '../rag/rag.service';
import { LlmService } from '../llm/llm.service';

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), HttpModule],
    controllers: [ApiController],
    providers: [ApiService, RagService, LlmService],
})
export class ApiModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware, HeaderMiddleware).forRoutes('/');
    }
}
