import { Module } from '@nestjs/common';

import { OllamaModule, RagModule } from '../../services';

import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
    imports: [OllamaModule, RagModule],
    controllers: [ChatController],
    providers: [ChatService],
})
export class ChatModule {}
