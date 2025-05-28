import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OllamaModule } from 'src/services/ollama/ollama.module';
import { RagModule } from 'src/services/rag/rag.module';

import databaseRegisteredConfig, { DatabaseConfig, defaultDatabaseConfig } from '../config/database.config';
import { ChatHistoryEntity, LlmModelEntity, ProcessedFile } from '../entities';
import { HeaderMiddleware } from '../middleware/header.middleware';
import { LoggerMiddleware } from '../middleware/logger.middleware';
import { ScannerModule } from '../services/scanner/scanner.module';

import { ChatModule } from './chat/chat.module';
import { DataModule } from './data/data.module';
import { HistoryModule } from './history/history.module';
import { ImageModule } from './image/image.module';
import { ModelsModule } from './models/models.module';
import { SttModule } from './stt/stt.module';
import { TtsModelModule } from './tts/tts-model.module';
import { TtsModule } from './tts-old/tts.module';
import { UtilsModule } from './utils/utils.module';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [databaseRegisteredConfig] }),
        TypeOrmModule.forRootAsync({
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
        ScannerModule,
        ChatModule,
        DataModule,
        HistoryModule,
        ImageModule,
        ModelsModule,
        UtilsModule,
        OllamaModule,
        TtsModule,
        TtsModelModule,
        SttModule,
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
