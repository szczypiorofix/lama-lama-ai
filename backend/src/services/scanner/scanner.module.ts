import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProcessedFile } from '../../entities';
import { RagModule, RagService } from '../';

@Module({
    imports: [TypeOrmModule.forFeature([ProcessedFile]), RagModule],
    providers: [RagService],
})
export class ScannerModule {}
