import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Post,
} from '@nestjs/common';
import { ApiService } from './api.service';
import { HttpService } from '@nestjs/axios';
import { AskDto } from '../dto/ask.dto';
import { LlamaResponseChunk, RagAskResponse } from '../shared/models';
import { ConfigService } from '@nestjs/config';
import { RagService } from '../rag/rag.service';
import { LlmService } from '../llm/llm.service';

@Controller('api')
export class ApiController {
    constructor(
        private readonly apiService: ApiService,
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        private readonly ragService: RagService,
        private readonly llmService: LlmService,
    ) {}

    @Get()
    getHello(): string {
        return this.apiService.getHello();
    }

    @Post('ask')
    async askQuestion(@Body() askDto: AskDto) {
        const { question } = askDto;
        console.log('Question: ', question);

        if (!question) {
            throw new HttpException('Question not found', HttpStatus.NOT_FOUND);
        }

        const responses: LlamaResponseChunk[] = [];
        try {
            const payload = {
                model: (this.configService.get('OLLAMA_MODEL') as string) || '',
                messages: [
                    {
                        role: 'user',
                        content: question,
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
            console.error('Error', err);
        }

        const responsesStringArray: string = responses
            .map((responseChunk) => responseChunk.message.content)
            .join('');

        const askResponse: RagAskResponse = {
            answer: responsesStringArray,
        };
        return askResponse;
    }

    @Post('ask-enhanced')
    async askEnhancedQuestion(@Body() askDto: AskDto) {
        const llamaModel: string =
            (this.configService.get('OLLAMA_MODEL') as string) || '';
        const llamaApiUrl: string =
            (this.configService.get('OLLAMA_API_URL') as string) || '';
        const context = await this.ragService.query(askDto.question);
        return this.llmService.generateResponse(askDto.question, context);
    }
}
