import { Injectable, MessageEvent } from '@nestjs/common';
import { from, mergeMap, Observable } from 'rxjs';

import { ChatQuestionDto } from '../../dto/chatQuestion.dto';
import { ChromaService } from '../../services/chroma/chroma.service';
import { OllamaService } from '../../services/ollama/ollama.service';

@Injectable()
export class ChatService {
    constructor(
        private ollamaService: OllamaService,
        private chromaService: ChromaService,
    ) {}

    public sendChatRequestToOllamaAndStreamAnswer(chatQuestion: ChatQuestionDto): Observable<MessageEvent> {
        return from(this.chromaService.queryDocuments(chatQuestion)).pipe(
            mergeMap((context) => {
                return new Observable<MessageEvent>((observer) => {
                    this.ollamaService.generateStreamingResponse(chatQuestion, observer, context);
                });
            }),
        );
    }
}
