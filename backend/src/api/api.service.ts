import { Injectable } from '@nestjs/common';
import { apiServiceDetails } from '../shared/constants';
import { LlamaService } from '../llama/llama.service';
import { AskDto } from '../dto/ask.dto';
import { RagService } from '../rag/rag.service';
import { UuidService } from '../uuid/uuid.service';

@Injectable()
export class ApiService {
    constructor(
        private readonly llamaService: LlamaService,
        private readonly ragService: RagService,
        private uuidService: UuidService,
    ) {}

    getHello(): string {
        return JSON.stringify(apiServiceDetails);
    }

    async postLlamaQuestionWithContext(askDto: AskDto) {
        return this.ragService.query(askDto.question);
    }

    async putDataFileIntoDatabase(file: Express.Multer.File) {
        const content: string = file.buffer.toString();
        const docId = this.uuidService.generate();
        return await this.ragService.addDocument(content, docId);
    }
}
