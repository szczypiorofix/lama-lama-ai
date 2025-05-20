import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { LoggerMiddleware } from '../middleware/logger.middleware';
import { HeaderMiddleware } from '../middleware/header.middleware';
import { ChatModule } from './chat/chat.module';
import { OllamaModule } from '../ollama/ollama.module';
import { RagModule } from '../rag/rag.module';
import { DataModule } from './data/data.module';
import { ImageModule } from './image/image.module';
import { ModelsModule } from './models/models.module';
import { UtilsModule } from './utils/utils.module';
import { HistoryModule } from './history/history.module';
import databaseRegisteredConfig, { DatabaseConfig, defaultDatabaseConfig } from '../config/database.config';
import { ChatHistoryEntity, LlmModelEntity, ProcessedFile } from '../entities';
import { TtsModule } from './tts/tts.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [databaseRegisteredConfig] }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const dbConfig: DatabaseConfig = configService.get<DatabaseConfig>('database') ?? defaultDatabaseConfig;
                return {
                    type: dbConfig.type,
                    host: dbConfig.host,
                    port: dbConfig.port,
                    username: dbConfig.username,
                    password: dbConfig.password,
                    database: dbConfig.database,
                    entities: [ChatHistoryEntity, LlmModelEntity, ProcessedFile],
                    synchronize: true,
                    // logging: true,
                    // logger: 'advanced-console',
                };
            },
        }),
        ScheduleModule.forRoot(),
        ChatModule,
        DataModule,
        HistoryModule,
        ImageModule,
        ModelsModule,
        UtilsModule,
        OllamaModule,
        TtsModule,
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
