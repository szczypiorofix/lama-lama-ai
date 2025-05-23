import { Injectable, MessageEvent } from '@nestjs/common';
import { from, mergeMap, Observable } from 'rxjs';
import { RagService } from 'src/services/rag/rag.service';

import { ChatQuestionDto } from '../../dto/chatQuestion.dto';
import { OllamaService } from '../../services/ollama/ollama.service';

@Injectable()
export class ChatService {
    constructor(
        private ollamaService: OllamaService,
        private ragService: RagService,
    ) {}

    public sendChatRequestToOllamaAndStreamAnswer(chatQuestion: ChatQuestionDto): Observable<MessageEvent> {
        return from(this.ragService.retrieveContextFromDatabase(chatQuestion)).pipe(
            mergeMap(
                (chromaCollectionDocuments: string[]) =>
                    new Observable<MessageEvent>((observer) => {
                        this.ollamaService.generateStreamingResponse(chatQuestion, observer, chromaCollectionDocuments);
                    }),
            ),
        );
    }
}
