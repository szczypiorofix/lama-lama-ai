import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HistoryModule } from '../../api/history/history.module';
import { LlmModelEntity } from '../../entities';

import { OllamaService } from './ollama.service';

@Module({
    imports: [TypeOrmModule.forFeature([LlmModelEntity]), HttpModule, HistoryModule],
    providers: [OllamaService],
    exports: [OllamaService],
})
export class OllamaModule {}
