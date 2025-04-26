import {
    HttpException,
    HttpStatus,
    Injectable,
    Logger,
    MessageEvent,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    LlamaResponseChunk,
    LlmImageList,
    OllamaStreamChunk,
    RagAskResponse,
} from '../shared/models';
import { AskDto } from '../dto/ask.dto';
import { HttpService } from '@nestjs/axios';
import axios, { AxiosResponse } from 'axios';
import { Readable } from 'stream';
import { ChromaCollectionDocuments } from '../rag/rag.service';
import { Subscriber } from 'rxjs';

interface OllamaMessages {
    role: 'system' | 'user';
    content: string;
}

@Injectable()
export class LlamaService {
    private readonly logger = new Logger(LlamaService.name);
    private readonly OLLAMA_URL: string;
    private readonly OLLAMA_MODEL: string;

    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
    ) {
        this.OLLAMA_URL =
            this.configService.get<string>('OLLAMA_API_URL') || '';
        this.OLLAMA_MODEL =
            this.configService.get<string>('OLLAMA_MODEL') || '';
    }

    public generateStreamingResponse(
        askDto: AskDto,
        observer: Subscriber<MessageEvent>,
        context: ChromaCollectionDocuments[] = [],
    ) {
        const { question, useContextOnly } = askDto;

        if (!question) {
            throw new HttpException('Question not found', HttpStatus.NOT_FOUND);
        }
        const messages: OllamaMessages[] = this.getQueryMessages(
            question,
            context,
            useContextOnly,
        );

        const requestUrl: string = this.OLLAMA_URL + '/api/chat';
        axios
            .post(
                requestUrl,
                {
                    model:
                        askDto.selectedModel ||
                        this.OLLAMA_MODEL ||
                        'tinyllama',
                    messages: messages,
                    stream: true,
                },
                { responseType: 'stream' },
            )
            .then((res: AxiosResponse<Readable>) => {
                res.data.on('data', (chunk: Buffer) => {
                    const lines: string[] = chunk
                        .toString()
                        .split('\n')
                        .filter(Boolean);
                    for (const line of lines) {
                        try {
                            const parsed: OllamaStreamChunk = JSON.parse(
                                line,
                            ) as OllamaStreamChunk;
                            if (parsed?.message?.content) {
                                observer.next({
                                    data: parsed.message.content,
                                });
                            }
                        } catch (err) {
                            this.logger.error(
                                'Error occurred while parsing JSON:',
                                err,
                            );
                        }
                    }
                });

                res.data.on('end', () => observer.complete());
                res.data.on('error', (err: Error) => observer.error(err));
            })
            .catch((err) => observer.error(err));
    }

    public async getAvailableModels(): Promise<LlmImageList> {
        const requestUrl: string = this.OLLAMA_URL + '/api/tags';
        const response = await this.httpService.get(requestUrl).toPromise();
        if (response) {
            const availableModels: LlmImageList = response.data as LlmImageList;
            console.log(availableModels);
            return availableModels;
        }
        throw new HttpException(
            'Error occurred while fetching models',
            HttpStatus.NOT_FOUND,
        );
    }

    public async generateResponse(
        askDto: AskDto,
        context: ChromaCollectionDocuments[] = [],
    ) {
        const { question, useContextOnly } = askDto;

        if (!question) {
            throw new HttpException('Question not found', HttpStatus.NOT_FOUND);
        }

        const messages: OllamaMessages[] = this.getQueryMessages(
            question,
            context,
            useContextOnly,
        );

        const responses: LlamaResponseChunk[] = [];
        try {
            const payload = {
                model: this.OLLAMA_MODEL,
                messages: messages,
            };

            const requestUrl: string = this.OLLAMA_URL + '/api/chat';
            const response = await this.httpService
                .post(requestUrl, payload, {
                    headers: { 'Content-Type': 'application/json' },
                })
                .toPromise();
            const raw: string = response ? (response.data as string) : '{}';
            const lines: string[] = raw
                .trim()
                .split('\n')
                .filter((line) => line.trim());
            for (const line of lines) {
                try {
                    const parsed = JSON.parse(line) as LlamaResponseChunk;
                    responses.push(parsed);
                } catch (e) {
                    console.error(e);
                }
            }
        } catch (err) {
            this.logger.error(
                'Error occurred while sending request to Ollama: ',
                err,
            );
            throw new HttpException(
                'Error occurred while sending request to Ollama: ' +
                    JSON.stringify(err),
                HttpStatus.NOT_FOUND,
            );
        }

        const responsesStringArray: string = responses
            .map((responseChunk) => responseChunk.message.content)
            .join('');

        const askResponse: RagAskResponse = {
            answer: responsesStringArray,
        };
        return askResponse;
    }

    private getQueryMessages(
        question: string,
        context: ChromaCollectionDocuments[] = [],
        useContextOnly: boolean = false,
    ): OllamaMessages[] {
        const contextForQuery: ChromaCollectionDocuments =
            context && Array.isArray(context) ? context.flat() : [];

        const contextAsString: string = contextForQuery.join('. \n');
        const systemQuery: string = useContextOnly
            ? "Answer strictly based on the provided context. If the answer is not found in the context, reply with 'I don't know'. Do not use any external knowledge."
            : 'Answer as accurately as possible, using the provided context if available. You may also use your own knowledge if needed.';
        const userQuery: string = `Context:\n${contextAsString}\n\nQuestion:\n${question}`;

        const messages: OllamaMessages[] = [
            {
                role: 'system',
                content: systemQuery,
            },
            {
                role: 'user',
                content: userQuery,
            },
        ];
        this.logger.log('Messages: ', messages);

        return messages;
    }
}
