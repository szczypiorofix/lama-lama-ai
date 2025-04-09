import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LlamaResponseChunk, RagAskResponse } from '../shared/models';
import { AskDto } from '../dto/ask.dto';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class LlamaService {
    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
    ) {}

    async generateResponse(askDto: AskDto, context: string[] = []) {
        const { question } = askDto;
        console.log('Question: ', question);

        if (!question) {
            throw new HttpException('Question not found', HttpStatus.NOT_FOUND);
        }

        // const final_query = `Give your answers formatted in HTML tags only. Do not add any non html content, start and end with <div> </div> only. Format using bullet points, bold, italic, etc. You are an assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question. Use the relevant part of the context provided. If you don't know the answer, just say that you don't know. Question: ${question} Context: ${firstOfContext}. Properly format your answer with html tags Answer:`;
        const useContextString: string =
            context.length > 0 ? `Use context: ${context.join(' ')} . ` : '';
        const final_query = `You are an assistant for question-answering tasks. If you don't know the answer, just say that you don't know. ${useContextString} Question: ${question}`;
        console.log(final_query);

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
}
