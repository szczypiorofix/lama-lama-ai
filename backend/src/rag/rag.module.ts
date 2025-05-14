import { Module } from '@nestjs/common';
import { RagService } from './rag.service';
import { LlamaModule } from '../llama/llama.module';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { UuidModule } from '../uuid/uuid.module';

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), HttpModule, LlamaModule, UuidModule],
    providers: [RagService],
    exports: [RagService],
})
export class RagModule {}
