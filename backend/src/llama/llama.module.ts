import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { LlamaService } from './llama.service';
import { HttpModule } from '@nestjs/axios';
import { HistoryModule } from '../api/history/history.module';
import { HistoryService } from '../api/history/history.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatHistoryEntity } from '../orm/chat-history.entity';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forFeature([ChatHistoryEntity]),
        HttpModule,
        HistoryModule,
    ],
    providers: [LlamaService, HistoryService],
    exports: [LlamaService, HistoryService],
})
export class LlamaModule {}
