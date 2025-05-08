import { Body, Controller, Get, Logger, Param, Post, Sse } from '@nestjs/common';
import { ModelsService } from './models.service';
import { LlmModelEntity } from '../../orm';
import { OllamaImageDto } from '../../dto/ollamaImage';
import { Observable } from 'rxjs';
import { Readable } from 'stream';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';

interface MessageEvent {
    data?: any;
    event?: string;
}

@Controller('api/models')
export class ModelsController {
    private readonly logger = new Logger(ModelsController.name);

    constructor(
        private readonly modelsService: ModelsService,
        private readonly httpService: HttpService,
    ) {}

    @Get()
    public async getAvailableLLMModels(): Promise<LlmModelEntity[]> {
        return await this.modelsService.getAvailableModels();
    }

    @Post('pull')
    public async pullOllamaImage(@Body() ollamaImage: OllamaImageDto): Promise<void> {
        await this.modelsService.pullOllamaImage(ollamaImage);
    }

    @Sse('pull/:name/stream')
    pullModel(@Param('name') modelName: string): Observable<MessageEvent> {
        return new Observable<MessageEvent>((observer) => {
            (async () => {
                try {
                    const response: AxiosResponse<Readable> = await this.httpService.axiosRef.post(
                        'http://localhost:11434/api/pull',
                        { name: modelName },
                        { responseType: 'stream' },
                    );

                    const stream = response.data;

                    let buffer = '';

                    stream.on('data', (chunk: Buffer) => {
                        buffer += chunk.toString();

                        let boundary = buffer.indexOf('\n');
                        while (boundary !== -1) {
                            const line = buffer.slice(0, boundary).trim();
                            buffer = buffer.slice(boundary + 1);

                            if (line) {
                                try {
                                    const json = JSON.parse(line);
                                    observer.next({ data: json });
                                } catch (err) {
                                    observer.next({ event: 'error', data: `Invalid JSON: ${line}` });
                                }
                            }

                            boundary = buffer.indexOf('\n');
                        }
                    });

                    stream.on('end', () => {
                        observer.next({ event: 'end', data: 'Model download complete' });
                        observer.complete();
                    });

                    stream.on('error', (err: Error) => {
                        observer.error({ event: 'error', data: err.message });
                    });

                } catch (err: unknown) {
                    const error = err as Error;
                    observer.error({ event: 'error', data: error.message });
                }
            })();
        });
    }
}
