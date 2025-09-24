import { Module } from '@nestjs/common';

import { RagModule } from '../rag/rag.module';

import { ScannerService } from './scanner.service';

@Module({
    imports: [RagModule],
    providers: [ScannerService],
})
export class ScannerModule {}
