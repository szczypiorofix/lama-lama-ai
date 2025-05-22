import { Body, Controller, Delete, Get, Logger, Param, Post, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';

import { OllamaImageDto } from '../../dto/ollamaImage';
import { LlmModelEntity } from '../../entities';
import { LlmImageDownloadResponse } from '../../shared/models';

import { ModelsService } from './models.service';

interface MessageEvent {
    data?: any;
    event?: string;
}

@Controller('api/models')
export class ModelsController {
    private readonly logger = new Logger(ModelsController.name);

    constructor(private readonly modelsService: ModelsService) {}

    @Get()
    public async getAvailableLLMModels(): Promise<LlmModelEntity[]> {
        return await this.modelsService.getAvailableModels();
    }

    @Post('pull')
    public async pullOllamaImage(@Body() ollamaImage: OllamaImageDto): Promise<LlmImageDownloadResponse> {
        return await this.modelsService.pullOllamaImage(ollamaImage);
    }

    @Delete('delete')
    public async deleteOllamaImage(@Body() ollamaImage: OllamaImageDto): Promise<LlmImageDownloadResponse> {
        return await this.modelsService.deleteOllamaImage(ollamaImage);
    }

    @Sse('pull/:name/stream')
    public pullModel(@Param('name') modelName: string): Observable<MessageEvent> {
        return this.modelsService.pullOllamaImageStream(modelName);
    }
}
