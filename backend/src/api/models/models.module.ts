import { Module } from '@nestjs/common';
import { ModelsController } from './models.controller';
import { ModelsService } from './models.service';
import { LlamaModule } from '../../llama/llama.module';

@Module({
    imports: [LlamaModule],
    controllers: [ModelsController],
    providers: [ModelsService],
})
export class ModelsModule {}
