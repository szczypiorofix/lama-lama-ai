import { Injectable, MessageEvent } from '@nestjs/common';
import { AskDto } from '../dto/ask.dto';
import { Observable } from 'rxjs';
import { LlamaService } from '../llama/llama.service';
import { ChromaCollectionDocuments } from '../rag/rag.service';

@Injectable()
export class ChatService {
    constructor(private llamaService: LlamaService) {}

    public sendChat(
        askDto: AskDto,
        context: ChromaCollectionDocuments[],
    ): Observable<MessageEvent> {
        return new Observable<MessageEvent>((observer) => {
            this.llamaService.generateStreamingResponse(
                askDto,
                observer,
                context,
            );
        });
    }
}
