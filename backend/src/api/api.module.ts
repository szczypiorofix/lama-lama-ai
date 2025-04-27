import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { LoggerMiddleware } from '../middleware/logger.middleware';
import { HeaderMiddleware } from '../middleware/header.middleware';
import { ChatModule } from './chat/chat.module';
import { LlamaModule } from '../llama/llama.module';
import { RagModule } from '../rag/rag.module';
import { DataModule } from './data/data.module';
import { ImageModule } from './image/image.module';
import { ModelsModule } from './models/models.module';
import { UtilsModule } from './utils/utils.module';
import { HistoryModule } from './history/history.module';
import { ChatHistoryEntity } from '../orm/chat-history.entity';
import databaseConfig, {
    DatabaseConfig,
    defaultDatabaseConfig,
} from '../config/database.config';

// type: 'mysql',
// host: process.env.MYSQL_HOST || 'lama_mysql',
// port: parseInt(process.env.MYSQL_PORT || '3306', 10),
// username: process.env.MYSQL_USERNAME || 'root',
// password: process.env.MYSQL_PASSWORD || '',
// database: process.env.MYSQL_DATABASE || 'lamalamadb',

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [databaseConfig] }),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'lama_mysql',
            port: 3306,
            username: 'root',
            password: '',
            database: 'lamalamadb',
            entities: [ChatHistoryEntity],
            synchronize: true,
            logging: true,
            logger: 'advanced-console',
        }),
        // TypeOrmModule.forRootAsync({
        //     imports: [ConfigModule],
        //     inject: [ConfigService],
        //     useFactory: (configService: ConfigService) => {
        //         const dbConfig: DatabaseConfig =
        //             configService.get<DatabaseConfig>('database') ??
        //             defaultDatabaseConfig;
        //         return {
        //             type: 'mysql',
        //             host: 'lama_mysql',
        //             port: 3306,
        //             username: 'root',
        //             password: '',
        //             database: 'lamalamadb',
        //             entities: [ChatHistoryEntity],
        //             synchronize: true,
        //             logging: true,
        //             logger: 'advanced-console',
        //         };
        //     },
        // }),
        ChatModule,
        DataModule,
        HistoryModule,
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
