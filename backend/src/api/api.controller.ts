import {
    Body,
    Controller,
    Get,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { ApiService } from './api.service';
import { AskDto } from '../dto/ask.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller('api')
export class ApiController {
    constructor(private readonly apiService: ApiService) {}

    @Get()
    getHello(): string {
        return this.apiService.getHello();
    }

    @Post('ask')
    async askEnhancedQuestion(@Body() askDto: AskDto) {
        return await this.apiService.postLlamaQuestionWithContext(askDto);
    }

    @Post('sendfile')
    @UseInterceptors(FileInterceptor('file'))
    async sendFile(@UploadedFile() file: Express.Multer.File) {
        console.log('Received file:', file.originalname);
        console.log('Content:', file.buffer.toString());
        await this.apiService.putDataFileIntoDatabase(file);
        return {
            message: 'File uploaded successfully.',
            fileName: file.originalname,
            code: 200,
        };
    }
}
