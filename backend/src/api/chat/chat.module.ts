import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { OllamaModule } from '../../ollama/ollama.module';
import { RagModule } from '../../rag/rag.module';

@Module({
    imports: [OllamaModule, RagModule],
    controllers: [ChatController],
    providers: [ChatService],
})
export class ChatModule {}
