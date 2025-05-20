import { Injectable, MessageEvent } from '@nestjs/common';
import { ChatQuestionDto } from '../../dto/chatQuestion.dto';
import { from, mergeMap, Observable } from 'rxjs';
import { OllamaService } from '../../ollama/ollama.service';
import { RagService } from '../../rag/rag.service';

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
