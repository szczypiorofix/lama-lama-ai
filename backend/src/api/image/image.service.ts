import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { OllamaLlavaStreamChunk } from '../../shared/models';

@Injectable()
export class ImageService {
    private readonly OLLAMA_URL: string;

    constructor(private readonly configService: ConfigService) {
        this.OLLAMA_URL =
            this.configService.get<string>('OLLAMA_API_URL') || '';
    }

    public async analyzeImage(file: Express.Multer.File): Promise<string> {
        const base64Image: string = file.buffer.toString('base64');
        const requestUrl: string = this.OLLAMA_URL + '/api/generate';
        const response = await axios.post(requestUrl, {
            model: 'llava:7b',
            prompt: 'What is in this image?',
            images: [base64Image],
        });

        const responseData: string = response.data as string;
        const lines: string[] = responseData.split('\n');
        const chunks: OllamaLlavaStreamChunk[] = lines.map((line) => {
            let l: OllamaLlavaStreamChunk = {
                model: '',
                done: false,
                created_at: '',
                response: '',
            };
            try {
                if (line.trim() !== '') {
                    l = JSON.parse(line) as OllamaLlavaStreamChunk;
                }
            } catch (err) {
                console.error('error ar line: ', line);
                console.error(err);
            }

            return {
                response: l.response,
                done: l.done,
                created_at: l.created_at,
                model: l.model,
            };
        });

        return chunks.map((item) => item.response).join('');
    }
}
