import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ChatHistoryEntity } from '../../entities';

@Injectable()
export class HistoryService {
    constructor(
        @InjectRepository(ChatHistoryEntity)
        private readonly chatHistoryRepository: Repository<ChatHistoryEntity>,
    ) {}

    /**
     * Save a new chat message to the database
     */
    async saveChatMessage(userQuestion: string, modelAnswer: string, modelName: string): Promise<ChatHistoryEntity> {
        const chatMessage: ChatHistoryEntity = this.chatHistoryRepository.create({
            userQuestion,
            modelAnswer,
            modelName,
        });

        return this.chatHistoryRepository.save(chatMessage);
    }

    /**
     * (Optional) Get last N chat messages
     */
    async getRecentChats(limit = 10): Promise<ChatHistoryEntity[]> {
        return this.chatHistoryRepository.find({
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }
}
