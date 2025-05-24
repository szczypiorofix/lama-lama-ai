import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import { Response } from 'express';
import { Readable } from 'stream';

@Injectable()
export class TtsService {
    private readonly PIPER_TTS_URL: string;

    constructor(private readonly configService: ConfigService) {
        this.PIPER_TTS_URL = this.configService.get<string>('PIPER_TTS_URL') || '';
    }

    public async synthesize(text: string, res: Response) {
        if (!text) {
            throw new HttpException('Missing text', 400);
        }

        console.log('Text:', text);
        const requestUrl: string = this.PIPER_TTS_URL + '/tts';
        try {
            const response: AxiosResponse<Readable> = await axios.post(
                requestUrl,
                { text },
                { responseType: 'stream' },
            );
            res.set({
                'Content-Type': 'audio/wav',
                'Content-Disposition': 'inline; filename="tts.wav"',
            });

            console.log('Response:', response);

            response.data.pipe(res);
            response.data.on('end', () => res.end());
        } catch (error) {
            console.error('TTS proxy error:', error);
            throw new HttpException('TTS request failed', 500);
        }
    }
}
