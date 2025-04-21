import {
    Body,
    Controller,
    Logger,
    MessageEvent,
    Post,
    Query,
    Sse,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { Observable } from 'rxjs';
import { AskDto } from '../../dto/ask.dto';

@Controller('api/chat')
export class ChatController {
    private readonly logger = new Logger(ChatController.name);

    constructor(private readonly chatService: ChatService) {}

    /**
     * Send a message to the chatbox and stream the answer to the client.
     *
     * @param question - question to ask the chatbot
     * @param strictAnswer - is answer strict or not (distance threshold)
     * @param useContextOnly - use context only or not
     * @returns Observable<MessageEvent> - stream of messages from the server
     */
    @Sse('message')
    public stream(
        @Query('question') question: string,
        @Query('strict-answer') strictAnswer: boolean = false,
        @Query('use-context-only') useContextOnly: boolean = true,
    ): Observable<MessageEvent> {
        return this.chatService.sendChat({
            question,
            strictAnswer,
            useContextOnly,
        });
    }

    /**
     * Send a message to the chatbot.
     *
     * @param askDto - message to ask the chatbot
     * @returns Promise<RagAskResponse> - chatbot response
     */
    @Post('message')
    public async sendMessageToChatBot(@Body() askDto: AskDto) {
        return await this.chatService.postLlamaQuestionWithContext(askDto);
    }
}
