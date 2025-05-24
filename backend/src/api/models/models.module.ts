import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { OllamaModule } from '../../services/ollama/ollama.module';

import { ModelsController } from './models.controller';
import { ModelsService } from './models.service';

@Module({
    imports: [OllamaModule, HttpModule],
    controllers: [ModelsController],
    providers: [ModelsService],
})
export class ModelsModule {}
