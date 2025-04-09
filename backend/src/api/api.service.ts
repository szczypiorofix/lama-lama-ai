import { Injectable } from '@nestjs/common';
import { apiServiceDetails } from '../shared/constants';
import { LlamaService } from '../llama/llama.service';
import { AskDto } from '../dto/ask.dto';

@Injectable()
export class ApiService {
    constructor(private readonly llamaService: LlamaService) {}

    getHello(): string {
        return JSON.stringify(apiServiceDetails);
    }

    async postLlamaQuestion(askDto: AskDto) {
        const context: string[] = [''];
        return this.llamaService.generateResponse(askDto, context);
    }
}
