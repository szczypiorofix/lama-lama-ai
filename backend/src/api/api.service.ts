import { Injectable } from '@nestjs/common';
import { apiServiceDetails } from '../shared/constants';
import { LlamaService } from '../llama/llama.service';
import { AskDto } from '../dto/ask.dto';
import { RagService } from '../rag/rag.service';

@Injectable()
export class ApiService {
    constructor(
        private readonly llamaService: LlamaService,
        private readonly ragService: RagService,
    ) {}

    getHello(): string {
        return JSON.stringify(apiServiceDetails);
    }

    async postLlamaQuestionWithContext(askDto: AskDto) {
        return this.ragService.query(askDto.question);
    }

    async putDataFileIntoDatabase(file: Express.Multer.File) {
        const content: string = file.buffer.toString();
        return await this.ragService.addToCollection(content);
    }
}
