import { Module } from '@nestjs/common';
import { ScannerService } from './scanner.service';
import { RagService } from '../rag/rag.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessedFile } from '../../entities';
import { UuidService } from '../uuid/uuid.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ProcessedFile]),
        ScannerModule
    ],
    providers: [ScannerService, RagService, UuidService],
    exports: [ScannerService, RagService, UuidService],
})
export class ScannerModule {}
