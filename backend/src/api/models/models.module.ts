import { Module } from '@nestjs/common';
import { ModelsController } from './models.controller';
import { ModelsService } from './models.service';
import { LlamaModule } from '../../llama/llama.module';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [LlamaModule, HttpModule],
    controllers: [ModelsController],
    providers: [ModelsService],
})
export class ModelsModule {}
