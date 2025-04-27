import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatHistoryEntity } from '../../orm/chat-history.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HistoryService {
    constructor(
        @InjectRepository(ChatHistoryEntity)
        private readonly chatHistoryRepository: Repository<ChatHistoryEntity>,
    ) {}

    /**
     * Save a new chat message to the database
     */
    async saveChatMessage(
        userQuestion: string,
        modelAnswer: string,
    ): Promise<ChatHistoryEntity> {
        const chatMessage: ChatHistoryEntity =
            this.chatHistoryRepository.create({
                userQuestion,
                modelAnswer,
            });

        return await this.chatHistoryRepository.save(chatMessage);
    }

    /**
     * (Optional) Get last N chat messages
     */
    async getRecentChats(limit = 10): Promise<ChatHistoryEntity[]> {
        return await this.chatHistoryRepository.find({
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }
}
