import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { SttService } from './stt.service';

@Controller('api/stt')
export class SttController {
    constructor(private readonly sttService: SttService) {}

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    public async transcribe(@UploadedFile() file: Express.Multer.File) {
        const text = await this.sttService.transcribe(file);
        return { text };
    }
}
