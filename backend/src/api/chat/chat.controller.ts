import {
    Body,
    Controller,
    MessageEvent,
    Post,
    Query,
    Sse,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { Observable } from 'rxjs';
import { ChatQuestionDto } from '../../dto/chatQuestionDto';

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
    public stream(
        @Query('question') question: string,
        @Query('selectedModel') selectedModel: string,
        @Query('strictAnswer') strictAnswer: boolean = false,
        @Query('useContextOnly') useContextOnly: boolean = true,
    ): Observable<MessageEvent> {
        return this.chatService.sendChat({
            question,
            strictAnswer,
            selectedModel,
            useContextOnly,
        });
    }

    /**
     * Send a message to the chatbot.
     *
     * @returns Promise<RagAskResponse> - chatbot response
     * @param chatQuestion
     */
    @Post('message')
    public async sendMessageToChatBot(@Body() chatQuestion: ChatQuestionDto) {
        return await this.chatService.postLlamaQuestionWithContext(
            chatQuestion,
        );
    }
}
