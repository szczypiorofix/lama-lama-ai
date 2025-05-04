import { Module } from '@nestjs/common';
import { RagService } from './rag.service';
import { LlamaModule } from '../llama/llama.module';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), HttpModule, LlamaModule],
    providers: [RagService],
    exports: [RagService],
})
export class RagModule {}
