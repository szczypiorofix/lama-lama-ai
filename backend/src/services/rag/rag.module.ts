import { Module } from '@nestjs/common';
import { RagService } from './rag.service';
import { OllamaModule } from '../ollama/ollama.module';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { UuidModule } from '../uuid/uuid.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessedFile } from '../../entities';
import { ScannerModule } from '../scanner/scanner.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forFeature([ProcessedFile]),
        HttpModule,
        OllamaModule,
        ScannerModule,
        UuidModule,
    ],
    providers: [RagService],
    exports: [RagService],
})
export class RagModule {}
