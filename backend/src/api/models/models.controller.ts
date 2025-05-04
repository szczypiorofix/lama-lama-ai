import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { ModelsService } from './models.service';
import { LlmModelEntity } from '../../orm';
import { OllamaImageDto } from '../../dto/ollamaImage';

@Controller('api/models')
export class ModelsController {
    private readonly logger = new Logger(ModelsController.name);

    constructor(private readonly modelsService: ModelsService) {}

    @Get()
    public async getAvailableLLMModels(): Promise<LlmModelEntity[]> {
        return await this.modelsService.getAvailableModels();
    }

    @Post('pull')
    public async pullOllamaImage(@Body() ollamaImage: OllamaImageDto) {
        return await this.modelsService.pullOllamaImage(ollamaImage);
    }
}
