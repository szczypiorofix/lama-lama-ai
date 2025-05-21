import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('chat_history')
export class ChatHistoryEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    userQuestion: string;

    @Column('text')
    modelAnswer: string;

    @Column('text')
    modelName: string;

    @CreateDateColumn()
    createdAt: Date;
}
