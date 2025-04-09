import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiService } from './api.service';
import { AskDto } from '../dto/ask.dto';
import { AddDocumentListDto } from '../dto/add-document.dto';

@Controller('api')
export class ApiController {
    constructor(private readonly apiService: ApiService) {}

    @Get()
    getHello(): string {
        return this.apiService.getHello();
    }

    @Post('ask')
    async askQuestion(@Body() askDto: AskDto) {
        return await this.apiService.postLlamaQuestion(askDto);
    }

    @Post('ask-context')
    async askEnhancedQuestion(@Body() askDto: AskDto) {
        return await this.apiService.postLlamaQuestionWithContext(askDto);
    }

    @Post('putdata')
    async putData(@Body() addDocumentList: AddDocumentListDto) {
        return await this.apiService.putDataIntoDatabase(addDocumentList);
    }
}
