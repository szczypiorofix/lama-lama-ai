import { Module } from '@nestjs/common';
import { RagModule } from 'src/services/rag/rag.module';

import { OllamaModule } from '../../services/ollama/ollama.module';

import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
    imports: [OllamaModule, RagModule],
    controllers: [ChatController],
    providers: [ChatService],
})
export class ChatModule {}
