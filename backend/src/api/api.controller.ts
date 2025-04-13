import {
    Body,
    Controller,
    Get,
    Post,
    UploadedFile,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { ApiService } from './api.service';
import { AskDto } from '../dto/ask.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
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

    @Post('uploadfile')
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

    @Post('uploadfiles')
    @UseInterceptors(FilesInterceptor('files'))
    async sendFileMultiple(@UploadedFiles() files: Express.Multer.File[]) {
        console.log(`'Received ${files.length} files(s)`);
        for (const file of files) {
            console.log('Received file:', file.originalname);
            await this.apiService.putDataFileIntoDatabase(file);
        }
        return {
            message: `Files (${files.length} total) uploaded successfully.`,
            fileName: '',
            code: 200,
        };
    }
}
