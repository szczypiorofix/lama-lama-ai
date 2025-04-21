import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { LlamaModule } from '../../llama/llama.module';
import { RagModule } from '../../rag/rag.module';

@Module({
    imports: [LlamaModule, RagModule],
    controllers: [ChatController],
    providers: [ChatService],
})
export class ChatModule {}
