import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { OllamaImageDto } from '../../dto/ollamaImage';
import { LlmModelEntity } from '../../entities';
import { OllamaService } from '../../services/ollama/ollama.service';
import { LlmImageDownloadResponse } from '../../shared/models';

@Injectable()
export class ModelsService {
    constructor(private readonly ollamaService: OllamaService) {}

    public async getAvailableModels(): Promise<LlmModelEntity[]> {
        return this.ollamaService.getAvailableModels();
    }

    public async pullOllamaImage(ollamaImage: OllamaImageDto): Promise<LlmImageDownloadResponse> {
        return this.ollamaService.pullImage(ollamaImage);
    }

    public async deleteOllamaImage(ollamaImage: OllamaImageDto): Promise<LlmImageDownloadResponse> {
        return this.ollamaService.deleteImage(ollamaImage);
    }

    public pullOllamaImageStream(modelName: string): Observable<MessageEvent> {
        return new Observable((subscriber) => {
            this.ollamaService.pullImageStream(modelName, subscriber);
        });
    }
}
