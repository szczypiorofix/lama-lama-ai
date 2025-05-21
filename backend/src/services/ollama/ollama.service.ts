import { HttpException, HttpStatus, Injectable, Logger, MessageEvent, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    LlmImage,
    LlmImageDownloadResponse,
    LlmImageList,
    OllamaChatStreamChunk,
    OllamaStreamResponse,
    PullingImageModel,
} from '../../shared/models';
import { ChatQuestionDto } from '../../dto/chatQuestion.dto';
import { HttpService } from '@nestjs/axios';
import axios, { AxiosResponse } from 'axios';
import { Readable } from 'stream';
import { ChromaCollectionDocuments } from '../rag/rag.service';
import { Subscriber } from 'rxjs';
import { HistoryService } from '../../api/history/history.service';
import { DEFAULT_LLM_MODELS } from '../../shared/constants/LlmModels.data';
import { LlmModelEntity } from '../../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OllamaImageDto } from '../../dto/ollamaImage';

interface OllamaMessages {
    role: 'system' | 'user';
    content: string;
}

@Injectable()
export class OllamaService implements OnModuleInit {
    private readonly logger = new Logger(OllamaService.name);
    private readonly OLLAMA_URL: string;
    private readonly OLLAMA_MODEL: string;
    private chatResponse: string;
    private chatQuestion: string;

    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
        private readonly historyService: HistoryService,
        @InjectRepository(LlmModelEntity)
        private readonly llmModelRepository: Repository<LlmModelEntity>,
    ) {
        this.OLLAMA_URL = this.configService.get<string>('OLLAMA_API_URL') || '';
        this.OLLAMA_MODEL = this.configService.get<string>('OLLAMA_MODEL') || '';
        this.chatResponse = '';
        this.chatQuestion = '';
    }

    async onModuleInit() {
        await this.initializeSettings();
    }

    public generateStreamingResponse(
        chatQuestion: ChatQuestionDto,
        observer: Subscriber<MessageEvent>,
        context: string[] = [],
    ) {
        const { question, useContextOnly, selectedModel } = chatQuestion;
        if (!question) {
            throw new HttpException('Question not found', HttpStatus.NOT_FOUND);
        }
        const messages: OllamaMessages[] = this.getQueryMessages(question, context, useContextOnly);

        this.chatResponse = '';
        this.chatQuestion = question;

        const requestUrl: string = this.OLLAMA_URL + '/api/chat';
        axios
            .post(
                requestUrl,
                {
                    model: selectedModel || this.OLLAMA_MODEL || 'tinyllama',
                    messages: messages,
                    stream: true,
                },
                { responseType: 'stream' },
            )
            .then((res: AxiosResponse<Readable>) => {
                res.data.on('data', (chunk: Buffer) => {
                    const lines: string[] = chunk.toString().split('\n').filter(Boolean);
                    for (const line of lines) {
                        try {
                            const parsed: OllamaChatStreamChunk = JSON.parse(line) as OllamaChatStreamChunk;
                            if (parsed?.message?.content) {
                                this.chatResponse += parsed.message.content;

                                const responseChunk: OllamaStreamResponse = {
                                    message: parsed.message.content,
                                    type: 'answer',
                                    sources: [],
                                };
                                observer.next({
                                    data: responseChunk,
                                });
                            }
                        } catch (err) {
                            this.logger.error('Error occurred while parsing JSON:', err);
                        }
                    }
                });

                res.data.on('end', () => {
                    const sourcesData: OllamaStreamResponse = {
                        message: '',
                        type: 'sources',
                        sources: context || [],
                    };
                    const sourcesEventData: MessageEvent = {
                        data: sourcesData,
                    };
                    observer.next(sourcesEventData);

                    void (async () => {
                        await this.historyService.saveChatMessage(this.chatQuestion, this.chatResponse);
                    })();

                    const endingEventData: OllamaStreamResponse = {
                        message: 'Response complete',
                        type: 'answer',
                        sources: [],
                    };
                    const endingEvent: MessageEvent = {
                        data: endingEventData,
                        type: 'end',
                    };
                    observer.next(endingEvent);

                    observer.complete();
                });
                res.data.on('error', (err: Error) => {
                    this.logger.error('Exios stream on error:', err);
                    observer.error(err);
                });
            })
            .catch((err) => {
                this.logger.error('Exios post catch error:', err);
                observer.error(err);
            });
    }

    public pullImageStream(modelName: string, observer: Subscriber<MessageEvent>) {
        const requestUrl: string = this.OLLAMA_URL + '/api/pull';
        try {
            axios
                .post(requestUrl, { name: modelName }, { responseType: 'stream' })
                .then((response: AxiosResponse<Readable>) => {
                    const stream: Readable = response.data;

                    let buffer: string = '';

                    stream.on('data', (chunk: Buffer) => {
                        buffer += chunk.toString();

                        let boundary = buffer.indexOf('\n');
                        while (boundary !== -1) {
                            const line: string = buffer.slice(0, boundary).trim();
                            buffer = buffer.slice(boundary + 1);

                            if (line) {
                                try {
                                    const pullingImage: PullingImageModel = JSON.parse(line) as PullingImageModel;
                                    observer.next({ data: pullingImage });
                                } catch (err) {
                                    console.error(err);
                                    const me: MessageEvent = {
                                        data: `Error: Invalid JSON: ${line}`,
                                        type: 'error',
                                    };
                                    observer.next(me);
                                    observer.complete();
                                }
                            }

                            boundary = buffer.indexOf('\n');
                        }
                    });

                    stream.on('end', () => {
                        const me: MessageEvent = {
                            data: 'Model download complete',
                            type: 'end',
                        };
                        observer.next(me);
                        observer.complete();
                    });

                    stream.on('error', (err: Error) => {
                        observer.error({ event: 'error', data: err.message });
                    });
                })
                .catch((err) => console.error(err));
        } catch (err: unknown) {
            const error = err as Error;
            observer.error({ event: 'error', data: error.message });
        }
    }

    public async pullImage(ollamaImage: OllamaImageDto): Promise<LlmImageDownloadResponse> {
        const requestUrl: string = this.OLLAMA_URL + '/api/pull';
        const payload = {
            model: ollamaImage.name,
        };
        const response = await this.httpService
            .post(requestUrl, payload, {
                headers: { 'Content-Type': 'application/json' },
            })
            .toPromise();

        console.log('Pull image response data: ', response?.data);

        return {
            message: 'Image downloaded successfully.',
            success: true,
        };
    }

    public async deleteImage(ollamaImage: OllamaImageDto): Promise<LlmImageDownloadResponse> {
        const requestUrl: string = this.OLLAMA_URL + '/api/delete';
        const payload = {
            model: ollamaImage.name,
        };

        console.log(payload);

        const response = await this.httpService
            .delete(requestUrl, {
                data: payload,
                headers: { 'Content-Type': 'application/json' },
            })
            .toPromise();

        console.log('Delete image image response data: ', response?.data);

        return {
            message: 'Image deleted successfully.',
            success: true,
        };
    }

    public async getAvailableModels(): Promise<LlmModelEntity[]> {
        const requestUrl: string = this.OLLAMA_URL + '/api/tags';
        const response = await this.httpService.get(requestUrl).toPromise();
        if (response) {
            const ollamaModels: LlmImageList = response.data as LlmImageList;
            const availableModels: LlmModelEntity[] = [];
            for (const llmModel of DEFAULT_LLM_MODELS) {
                const existingLlmModel: LlmModelEntity | null = await this.llmModelRepository.findOneBy({
                    id: llmModel.id,
                });
                if (existingLlmModel) {
                    const foundOllamaModel: LlmImage | undefined = this.checkOllamaModels(
                        ollamaModels,
                        existingLlmModel,
                    );
                    existingLlmModel.downloaded = !!foundOllamaModel;
                    await this.llmModelRepository.save(existingLlmModel);
                    availableModels.push(existingLlmModel);
                }
            }
            return availableModels;
        }

        throw new HttpException('Error occurred while fetching models', HttpStatus.NOT_FOUND);
    }

    private async initializeSettings() {
        for (const llmModel of DEFAULT_LLM_MODELS) {
            const existingLlmModel = await this.llmModelRepository.findOneBy({
                id: llmModel.id,
            });
            if (!existingLlmModel) {
                await this.llmModelRepository.save(llmModel);
            }
        }
    }

    private checkOllamaModels(ollamaModels: LlmImageList, llmModel: LlmModelEntity): LlmImage | undefined {
        return ollamaModels.models.find((ollamaModel) => {
            const ollamaModelNameParts: string[] = ollamaModel.name.split(':');
            if (ollamaModelNameParts.length !== 2) {
                throw new HttpException('Error occurred while parsing Ollama model name', HttpStatus.NOT_FOUND);
            }
            const ollamaModelName: string = ollamaModelNameParts[0];
            const ollamaModelVersion: string = ollamaModelNameParts[1];
            return llmModel.name == ollamaModelName && llmModel.version == ollamaModelVersion;
        });
    }

    private getQueryMessages(
        question: string,
        context: string[] = [],
        useContextOnly: boolean = false,
    ): OllamaMessages[] {
        const contextForQuery: ChromaCollectionDocuments = context && Array.isArray(context) ? context.flat() : [];

        const contextAsString: string = contextForQuery.join('. \n');
        const systemQuery: string = useContextOnly
            ? "Answer strictly based on the provided context. If the answer is not found in the context, reply with 'I don't know'. Do not use any external knowledge."
            : 'Answer as accurately as possible, using the provided context if available. You may also use your own knowledge if needed.';
        const userQuery: string = `Context:\n${contextAsString}\n\nQuestion:\n${question}`;

        return [
            {
                role: 'system',
                content: systemQuery,
            },
            {
                role: 'user',
                content: userQuery,
            },
        ];
    }
}
