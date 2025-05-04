import { Injectable } from '@nestjs/common';
import { LlamaService } from '../../llama/llama.service';
import { LlmModelEntity } from '../../orm';
import { OllamaImageDto } from '../../dto/ollamaImage';
import { LlmImageDownloadResponse } from '../../shared/models';

@Injectable()
export class ModelsService {
    constructor(private readonly llamaService: LlamaService) {}

    public async getAvailableModels(): Promise<LlmModelEntity[]> {
        return await this.llamaService.getAvailableModels();
    }

    public async pullOllamaImage(ollamaImage: OllamaImageDto): Promise<LlmImageDownloadResponse> {
        return await this.llamaService.pullImage(ollamaImage);
    }
}
