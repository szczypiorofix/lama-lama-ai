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
    OllamaStreamChunk,
    RagAskResponse,
} from '../shared/models';
import { AskDto } from '../dto/ask.dto';
import { HttpService } from '@nestjs/axios';
import axios, { AxiosResponse } from 'axios';
import { Readable } from 'stream';
import { ChromaCollectionDocuments } from '../rag/rag.service';
import { Subscriber } from 'rxjs';

@Injectable()
export class LlamaService {
    private readonly logger = new Logger(LlamaService.name);

    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
    ) {}

    public generateStreamingResponse(
        askDto: AskDto,
        observer: Subscriber<MessageEvent>,
        context: ChromaCollectionDocuments[] = [],
    ) {
        const { question, usecontextonly } = askDto;

        if (!question) {
            throw new HttpException('Question not found', HttpStatus.NOT_FOUND);
        }
        const finalQuery: string = this.prepareQueryBasedOnContext(
            question,
            context,
            usecontextonly,
        );

        axios
            .post(
                this.configService.get<string>('OLLAMA_API_URL') || '',
                {
                    model: this.configService.get<string>('OLLAMA_MODEL') || '',
                    messages: [
                        {
                            role: 'user',
                            content: finalQuery,
                        },
                    ],
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
                            console.warn(
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

    public async generateResponse(
        askDto: AskDto,
        context: ChromaCollectionDocuments[] = [],
    ) {
        const { question, usecontextonly } = askDto;

        if (!question) {
            throw new HttpException('Question not found', HttpStatus.NOT_FOUND);
        }

        const finalQuery: string = this.prepareQueryBasedOnContext(
            question,
            context,
            usecontextonly,
        );

        this.logger.log(finalQuery);

        const responses: LlamaResponseChunk[] = [];
        try {
            const payload = {
                model: this.configService.get<string>('OLLAMA_MODEL') || '',
                messages: [
                    {
                        role: 'user',
                        content: finalQuery,
                    },
                ],
            };

            const response = await this.httpService
                .post(
                    this.configService.get<string>('OLLAMA_API_URL') || '',
                    payload,
                    {
                        headers: { 'Content-Type': 'application/json' },
                    },
                )
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

    private prepareQueryBasedOnContext(
        question: string,
        context: ChromaCollectionDocuments[] = [],
        useContextOnly: boolean = false,
    ): string {
        const contextForQuery: ChromaCollectionDocuments =
            context && Array.isArray(context) ? context.flat() : [];

        this.logger.log('Question: ', question);
        this.logger.log('Context: ', contextForQuery);

        const useContextOnlyString: string = useContextOnly
            ? `Use only the context: ${JSON.stringify(contextForQuery)} . If you don't find the answer in context, reply "I didn't find the answer in the given context"`
            : `Try to use context: ${JSON.stringify(contextForQuery)} . `;

        const useContextString: string =
            contextForQuery.length > 0 ? useContextOnlyString : '';
        const finalQuery: string = `You are an assistant for question-answering tasks. If you don't know the answer, just say that you don't know. ${useContextString} Try to answer the question in the language in which it was asked. Question: ${question}`;

        this.logger.log('Final query: ', finalQuery);

        return finalQuery;
    }
}
