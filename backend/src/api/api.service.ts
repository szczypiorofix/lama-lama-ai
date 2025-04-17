import { Injectable, MessageEvent } from '@nestjs/common';
import { apiServiceDetails } from '../shared/constants';
import { LlamaService } from '../llama/llama.service';
import { AskDto } from '../dto/ask.dto';
import { ChromaCollectionDocuments, RagService } from '../rag/rag.service';
import { UuidService } from '../uuid/uuid.service';
import { ChatService } from '../chat/chat.service';
import { from, mergeMap, Observable } from 'rxjs';

@Injectable()
export class ApiService {
    constructor(
        private readonly llamaService: LlamaService,
        private readonly ragService: RagService,
        private readonly chatService: ChatService,
        private uuidService: UuidService,
    ) {}

    public getHello(): string {
        return JSON.stringify(apiServiceDetails);
    }

    public sendChat(askDto: AskDto): Observable<MessageEvent> {
        return from(this.ragService.retrieveContextFromDatabase(askDto)).pipe(
            mergeMap((chromaCollectionDocuments) =>
                this.chatService.sendChat(askDto, [chromaCollectionDocuments]),
            ),
        );
    }

    public async postLlamaQuestionWithContext(askDto: AskDto) {
        const filteredDocuments: ChromaCollectionDocuments =
            await this.ragService.retrieveContextFromDatabase(askDto);
        return this.llamaService.generateResponse(askDto, [filteredDocuments]);
    }

    public async putDataFileIntoDatabase(file: Express.Multer.File) {
        const content: string = file.buffer.toString();
        const docId = this.uuidService.generate();
        return await this.ragService.addDocument(content, docId);
    }
}
