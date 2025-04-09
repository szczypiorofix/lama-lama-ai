import { Injectable } from '@nestjs/common';
import { apiServiceDetails } from '../shared/constants';
import { LlamaService } from '../llama/llama.service';
import { AskDto } from '../dto/ask.dto';
import { RagService } from '../rag/rag.service';
import { AddDocumentListDto } from '../dto/add-document.dto';

@Injectable()
export class ApiService {
    constructor(
        private readonly llamaService: LlamaService,
        private readonly ragService: RagService,
    ) {}

    getHello(): string {
        return JSON.stringify(apiServiceDetails);
    }

    async postLlamaQuestion(askDto: AskDto) {
        const context: (string | null)[][] = [];
        return this.llamaService.generateResponse(askDto, context);
    }

    async postLlamaQuestionWithContext(askDto: AskDto) {
        return this.ragService.query(askDto.question);
    }

    async putDataIntoDatabase(addDocumentList: AddDocumentListDto) {
        return this.ragService.addToCollection(addDocumentList);
    }
}
