import { Injectable, MessageEvent } from '@nestjs/common';
import { ChatQuestionDto } from '../../dto/chatQuestion.dto';
import { from, mergeMap, Observable } from 'rxjs';
import { LlamaService } from '../../llama/llama.service';
import { RagService } from '../../rag/rag.service';

@Injectable()
export class ChatService {
    constructor(
        private llamaService: LlamaService,
        private ragService: RagService,
    ) {}

    public sendChatRequestToOllamaAndStreamAnswer(chatQuestion: ChatQuestionDto): Observable<MessageEvent> {
        return from(this.ragService.retrieveContextFromDatabase(chatQuestion)).pipe(
            mergeMap(
                (chromaCollectionDocuments: string[]) =>
                    new Observable<MessageEvent>((observer) => {
                        this.llamaService.generateStreamingResponse(chatQuestion, observer, chromaCollectionDocuments);
                    }),
            ),
        );
    }
}
