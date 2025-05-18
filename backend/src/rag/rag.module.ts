import { Module } from '@nestjs/common';
import { RagService } from './rag.service';
import { LlamaModule } from '../llama/llama.module';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { UuidModule } from '../uuid/uuid.module';
import { ScannerService } from '../scanner/scanner.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessedFile } from '../orm';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forFeature([ProcessedFile]),
        HttpModule,
        LlamaModule,
        UuidModule,
    ],
    providers: [RagService, ScannerService],
    exports: [RagService],
})
export class RagModule {}
