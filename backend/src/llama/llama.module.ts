import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { LlamaService } from './llama.service';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), HttpModule],
    providers: [LlamaService],
    exports: [LlamaService],
})
export class LlamaModule {}
