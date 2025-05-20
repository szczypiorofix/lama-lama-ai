import { Injectable } from '@nestjs/common';
import { LlamaService } from '../../llama/llama.service';
import { LlmModelEntity } from '../../entities';
import { OllamaImageDto } from '../../dto/ollamaImage';
import { LlmImageDownloadResponse } from '../../shared/models';
import { Observable } from 'rxjs';

@Injectable()
export class ModelsService {
    constructor(private readonly llamaService: LlamaService) {}

    public async getAvailableModels(): Promise<LlmModelEntity[]> {
        return await this.llamaService.getAvailableModels();
    }

    public async pullOllamaImage(ollamaImage: OllamaImageDto): Promise<LlmImageDownloadResponse> {
        return await this.llamaService.pullImage(ollamaImage);
    }

    public async deleteOllamaImage(ollamaImage: OllamaImageDto): Promise<LlmImageDownloadResponse> {
        return await this.llamaService.deleteImage(ollamaImage);
    }

    public pullOllamaImageStream(modelName: string): Observable<MessageEvent> {
        return new Observable((subscriber) => {
            this.llamaService.pullImageStream(modelName, subscriber);
        });
    }
}
