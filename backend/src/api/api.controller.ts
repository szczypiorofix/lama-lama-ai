import {
    Body,
    Controller,
    Get,
    Logger,
    MessageEvent,
    Post,
    Query,
    Sse,
    UploadedFile,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { ApiService } from './api.service';
import { AskDto } from '../dto/ask.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { Observable } from 'rxjs';

@Controller('api')
export class ApiController {
    private readonly logger = new Logger(ApiController.name);

    constructor(private readonly apiService: ApiService) {}

    @Get()
    getHello(): string {
        return this.apiService.getHello();
    }

    @Post('ask')
    async askEnhancedQuestion(@Body() askDto: AskDto) {
        return await this.apiService.postLlamaQuestionWithContext(askDto);
    }

    @Sse('chat')
    stream(
        @Query('question') question: string,
        @Query('strictanswer') strictanswer: boolean = false,
        @Query('usecontextonly') usecontextonly: boolean = true,
    ): Observable<MessageEvent> {
        return this.apiService.sendChat({
            question: question,
            strictanswer: strictanswer,
            usecontextonly: usecontextonly,
        });
    }

    @Post('uploadfile')
    @UseInterceptors(FileInterceptor('file'))
    async sendFile(@UploadedFile() file: Express.Multer.File) {
        this.logger.log(`Received file: ${file.originalname}`);
        this.logger.log(
            `Received ${file.originalname} file (${Math.floor(file.size / 1024).toString(16)} kb).`,
        );
        await this.apiService.putDataFileIntoDatabase(file);
        return {
            message: `File ${file.originalname} uploaded successfully.`,
            fileName: file.originalname,
            code: 200,
        };
    }

    @Post('uploadfiles')
    @UseInterceptors(FilesInterceptor('files'))
    async sendFileMultiple(@UploadedFiles() files: Express.Multer.File[]) {
        this.logger.log(`Received ${files.length} files(s).`);
        for (const file of files) {
            this.logger.log(
                `Received ${file.originalname} file (${Math.floor(file.size / 1024).toString(16)} kb).`,
            );
            await this.apiService.putDataFileIntoDatabase(file);
        }
        return {
            message: `Files (${files.length} total) uploaded successfully.`,
            fileName: '',
            code: 200,
        };
    }
}
