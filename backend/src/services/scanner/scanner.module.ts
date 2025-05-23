import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProcessedFile } from '../../entities';
import { RagModule, ScannerService } from '../';

@Module({
    imports: [TypeOrmModule.forFeature([ProcessedFile]), RagModule],
    providers: [ScannerService],
})
export class ScannerModule {}
