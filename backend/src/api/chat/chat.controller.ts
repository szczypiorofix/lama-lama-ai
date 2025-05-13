import { Body, Controller, MessageEvent, Post, Query, Sse } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Observable } from 'rxjs';
import { ChatQuestionDto } from '../../dto/chatQuestion.dto';

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

    /**
     * Send a message to the chatbot.
     *
     * @returns Promise<RagAskResponse> - chatbot response
     * @param chatQuestion
     */
    @Post('message')
    public async fetchOllamaChatResponse(@Body() chatQuestion: ChatQuestionDto) {
        return await this.chatService.sendChatRequestToOllamaAndReturnAnswer(chatQuestion);
    }
}
