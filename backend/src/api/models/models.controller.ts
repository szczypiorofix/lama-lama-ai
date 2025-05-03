import { Controller, Get, Logger } from '@nestjs/common';
import { ModelsService } from './models.service';
import { LlmImageList } from '../../shared/models';

@Controller('api/models')
export class ModelsController {
    private readonly logger = new Logger(ModelsController.name);

    constructor(private readonly modelsService: ModelsService) {}

    @Get()
    public async getAvailableLLMModels(): Promise<LlmImageList> {
        return await this.modelsService.getDownloadedModels();
    }

    @Get('available')
    getAvailableModels(): string[] {
        return this.modelsService.getAvailableModels();
    }
}
