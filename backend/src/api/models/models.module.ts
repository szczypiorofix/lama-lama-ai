import { Module } from '@nestjs/common';
import { ModelsController } from './models.controller';
import { ModelsService } from './models.service';
import { OllamaModule } from '../../ollama/ollama.module';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [OllamaModule, HttpModule],
    controllers: [ModelsController],
    providers: [ModelsService],
})
export class ModelsModule {}
