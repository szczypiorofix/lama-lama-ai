import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import FormData from 'form-data';

@Injectable()
export class SttService {
    private readonly WHISPER_STT_URL: string;

    constructor(private readonly configService: ConfigService) {
        this.WHISPER_STT_URL = this.configService.get<string>('WHISPER_STT_URL') || '';
    }

    public async transcribe(file: Express.Multer.File): Promise<string> {
        if (!file) {
            throw new HttpException('Missing audio file', 400);
        }

        const formData = new FormData();
        formData.append('file', file.buffer, file.originalname);

        const headers = formData.getHeaders();
        const requestUrl: string = this.WHISPER_STT_URL + '/stt';
        const response: AxiosResponse<{ text: string }> = await axios.post(requestUrl, formData, { headers });

        return response.data.text || '';
    }
}
