import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiService } from './api.service';
import { AskDto } from '../dto/ask.dto';

@Controller('api')
export class ApiController {
    constructor(private readonly apiService: ApiService) {}

    @Get()
    getHello(): string {
        return this.apiService.getHello();
    }

    @Post('ask')
    async askEnhancedQuestion(@Body() askDto: AskDto) {
        return await this.apiService.postLlamaQuestion(askDto);
    }
}
