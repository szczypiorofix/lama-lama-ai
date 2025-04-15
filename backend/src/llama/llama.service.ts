import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LlamaResponseChunk, RagAskResponse } from '../shared/models';
import { AskDto } from '../dto/ask.dto';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class LlamaService {
    private readonly logger = new Logger(LlamaService.name);

    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
    ) {}

    async generateResponse(
        askDto: AskDto,
        context: (string | null)[][] = [],
        useContextOnly: boolean = false,
    ) {
        const { question } = askDto;

        if (!question) {
            throw new HttpException('Question not found', HttpStatus.NOT_FOUND);
        }

        const contextForQuery: (string | null)[] =
            context && Array.isArray(context) ? context.flat() : [];

        this.logger.log('Question: ', question);
        this.logger.log('Context: ', contextForQuery);

        const useContextOnlyString: string = useContextOnly
            ? `Use only the context: ${JSON.stringify(contextForQuery)} . `
            : `Try to use context: ${JSON.stringify(contextForQuery)} . `;

        const useContextString: string =
            contextForQuery.length > 0 ? useContextOnlyString : '';
        const final_query = `You are an assistant for question-answering tasks. If you don't know the answer, just say that you don't know. ${useContextString} Question: ${question}`;
        this.logger.log(final_query);

        const responses: LlamaResponseChunk[] = [];
        try {
            const payload = {
                model: (this.configService.get('OLLAMA_MODEL') as string) || '',
                messages: [
                    {
                        role: 'user',
                        content: final_query,
                    },
                ],
            };

            const response = await this.httpService
                .post(
                    (this.configService.get('OLLAMA_API_URL') as string) || '',
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
}
