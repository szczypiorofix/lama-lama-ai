import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProcessedFile } from '../../entities';
import { ChromaModule } from '../chroma/chroma.module';

import { ScannerService } from './scanner.service';

@Module({
    imports: [TypeOrmModule.forFeature([ProcessedFile]), ChromaModule],
    providers: [ScannerService],
})
export class ScannerModule {}
