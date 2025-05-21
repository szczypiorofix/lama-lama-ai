import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { OllamaModule } from '../../services/ollama/ollama.module';
import { RagModule } from '../../services/rag/rag.module';

@Module({
    imports: [OllamaModule, RagModule],
    controllers: [ChatController],
    providers: [ChatService],
})
export class ChatModule {}
