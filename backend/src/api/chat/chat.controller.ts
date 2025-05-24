import { Controller, MessageEvent, Query, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';

import { ChatQuestionDto } from '../../dto/chatQuestion.dto';

import { ChatService } from './chat.service';

@Controller('api/chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    /**
     * Send a message to the chatbox and stream the answer to the client.
     *
     * @param question - question to ask the chatbot
     * @param selectedModel - selected LLM
     * @param strictAnswer - is answer strict or not (distance threshold)
     * @param useContextOnly - use context only or not
     * @returns Observable<MessageEvent> - stream of messages from the server
     */
    @Sse('message')
    public fetchOllamaChatResponseAsStream(
        @Query('question') question: string,
        @Query('selectedModel') selectedModel: string,
        @Query('strictAnswer') strictAnswer: boolean = false,
        @Query('useContextOnly') useContextOnly: boolean = false,
    ): Observable<MessageEvent> {
        const chatQuestion: ChatQuestionDto = {
            question,
            strictAnswer,
            selectedModel,
            useContextOnly,
        };
        return this.chatService.sendChatRequestToOllamaAndStreamAnswer(chatQuestion);
    }
}
