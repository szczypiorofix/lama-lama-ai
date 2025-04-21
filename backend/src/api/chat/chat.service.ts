import { Injectable, MessageEvent } from '@nestjs/common';
import { AskDto } from '../../dto/ask.dto';
import { from, mergeMap, Observable } from 'rxjs';
import { LlamaService } from '../../llama/llama.service';
import { ChromaCollectionDocuments, RagService } from '../../rag/rag.service';

@Injectable()
export class ChatService {
    constructor(
        private llamaService: LlamaService,
        private ragService: RagService,
    ) {}

    public sendChat(askDto: AskDto): Observable<MessageEvent> {
        return from(this.ragService.retrieveContextFromDatabase(askDto)).pipe(
            mergeMap(
                (chromaCollectionDocuments) =>
                    new Observable<MessageEvent>((observer) => {
                        this.llamaService.generateStreamingResponse(
                            askDto,
                            observer,
                            [chromaCollectionDocuments],
                        );
                    }),
            ),
        );
    }

    public async postLlamaQuestionWithContext(askDto: AskDto) {
        const filteredDocuments: ChromaCollectionDocuments =
            await this.ragService.retrieveContextFromDatabase(askDto);
        return this.llamaService.generateResponse(askDto, [filteredDocuments]);
    }
}
