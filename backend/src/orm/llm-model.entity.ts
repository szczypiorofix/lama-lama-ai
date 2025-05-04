import { Column, CreateDateColumn, UpdateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('llm_model')
export class LlmModelEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    name: string;

    @Column('text', { default: 'latest' })
    version: string;

    @Column('boolean', { default: false })
    downloaded: boolean;

    @Column('integer', { default: 0 })
    size: number;

    @CreateDateColumn({ nullable: true, default: null })
    createdAt: Date | null;

    @UpdateDateColumn({ nullable: true, default: null })
    updatedAi: Date | null;
}
