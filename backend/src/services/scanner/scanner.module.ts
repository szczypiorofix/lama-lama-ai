import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProcessedFile } from '../../entities';
import { RagModule } from '../rag/rag.module';

import { ScannerService } from './scanner.service';

@Module({
    imports: [TypeOrmModule.forFeature([ProcessedFile]), RagModule],
    providers: [ScannerService],
})
export class ScannerModule {}
