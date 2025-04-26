import { Injectable, MessageEvent } from '@nestjs/common';
import { ChatQuestionDto } from '../../dto/chatQuestionDto';
import { from, mergeMap, Observable } from 'rxjs';
import { LlamaService } from '../../llama/llama.service';
import { ChromaCollectionDocuments, RagService } from '../../rag/rag.service';

@Injectable()
export class ChatService {
    constructor(
        private llamaService: LlamaService,
        private ragService: RagService,
    ) {}

    public sendChatRequestToOllamaAndStreamAnswer(
        chatQuestion: ChatQuestionDto,
    ): Observable<MessageEvent> {
        return from(
            this.ragService.retrieveContextFromDatabase(chatQuestion),
        ).pipe(
            mergeMap(
                (chromaCollectionDocuments) =>
                    new Observable<MessageEvent>((observer) => {
                        this.llamaService.generateStreamingResponse(
                            chatQuestion,
                            observer,
                            [chromaCollectionDocuments],
                        );
                    }),
            ),
        );
    }

    public async sendChatRequestToOllamaAndReturnAnswer(
        chatQuestion: ChatQuestionDto,
    ) {
        const filteredDocuments: ChromaCollectionDocuments =
            await this.ragService.retrieveContextFromDatabase(chatQuestion);
        return this.llamaService.generateResponse(chatQuestion, [
            filteredDocuments,
        ]);
    }
}
