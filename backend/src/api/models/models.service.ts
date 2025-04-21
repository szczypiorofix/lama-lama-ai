import { Injectable } from '@nestjs/common';
import { LlamaService } from '../../llama/llama.service';
import { LlmImageList } from '../../shared/models';

@Injectable()
export class ModelsService {
    constructor(private readonly llamaService: LlamaService) {}

    public async getAvailableLLMModels(): Promise<LlmImageList> {
        return await this.llamaService.getAvailableModels();
    }
}
