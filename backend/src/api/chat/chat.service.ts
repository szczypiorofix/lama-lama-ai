import { Injectable, MessageEvent } from '@nestjs/common';
import { from, mergeMap, Observable } from 'rxjs';

import { ChatQuestionDto } from '../../dto/chatQuestion.dto';
import { OllamaService, RagService } from '../../services';

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
