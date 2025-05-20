import { Injectable } from '@nestjs/common';
import { OllamaService } from '../../ollama/ollama.service';
import { LlmModelEntity } from '../../entities';
import { OllamaImageDto } from '../../dto/ollamaImage';
import { LlmImageDownloadResponse } from '../../shared/models';
import { Observable } from 'rxjs';

@Injectable()
export class ModelsService {
    constructor(private readonly ollamaService: OllamaService) {}

    public async getAvailableModels(): Promise<LlmModelEntity[]> {
        return await this.ollamaService.getAvailableModels();
    }

    public async pullOllamaImage(ollamaImage: OllamaImageDto): Promise<LlmImageDownloadResponse> {
        return await this.ollamaService.pullImage(ollamaImage);
    }

    public async deleteOllamaImage(ollamaImage: OllamaImageDto): Promise<LlmImageDownloadResponse> {
        return await this.ollamaService.deleteImage(ollamaImage);
    }

    public pullOllamaImageStream(modelName: string): Observable<MessageEvent> {
        return new Observable((subscriber) => {
            this.ollamaService.pullImageStream(modelName, subscriber);
        });
    }
}
