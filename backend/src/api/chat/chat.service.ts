import { Injectable, MessageEvent } from '@nestjs/common';
import { QueryResponse } from 'chromadb';
import { from, mergeMap, Observable } from 'rxjs';

import { ChatQuestionDto } from '../../dto/chatQuestion.dto';
import { ChromaService } from '../../services/chroma/chroma.service';
import { OllamaService } from '../../services/ollama/ollama.service';
import { queryResponseConverter } from '../../shared/helpers/queryResponseConverter.helper';

@Injectable()
export class ChatService {
    constructor(
        private ollamaService: OllamaService,
        private chromaService: ChromaService,
    ) {}

    public sendChatRequestToOllamaAndStreamAnswer(chatQuestion: ChatQuestionDto): Observable<MessageEvent> {
        return from(this.chromaService.queryDocuments(chatQuestion.question)).pipe(
            mergeMap((chromaCollectionDocuments: QueryResponse) => {
                const context: string[] = queryResponseConverter(chromaCollectionDocuments);
                return new Observable<MessageEvent>((observer) => {
                    this.ollamaService.generateStreamingResponse(chatQuestion, observer, context);
                });
            }),
        );
    }
}
