import { Module } from '@nestjs/common';

import { ChromaModule } from '../../services/chroma/chroma.module';
import { OllamaModule } from '../../services/ollama/ollama.module';

import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
    imports: [OllamaModule, ChromaModule],
    controllers: [ChatController],
    providers: [ChatService],
})
export class ChatModule {}
