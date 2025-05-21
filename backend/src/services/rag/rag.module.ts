import { Module } from '@nestjs/common';
import { RagService } from './rag.service';
import { OllamaModule } from '../ollama/ollama.module';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { UuidModule } from '../uuid/uuid.module';
import { ScannerService } from '../scanner/scanner.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessedFile } from '../../entities';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forFeature([ProcessedFile]),
        HttpModule,
        OllamaModule,
        UuidModule,
    ],
    providers: [RagService, ScannerService],
    exports: [RagService],
})
export class RagModule {}
