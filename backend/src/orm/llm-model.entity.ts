import { LlmModelPurpose } from 'src/shared/enums';
import { Column, CreateDateColumn, UpdateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('llm_model')
export class LlmModelEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    name: string;

    @Column({ type: 'text', default: 'latest' })
    version: string;

    @Column({ type: 'boolean', default: false })
    downloaded: boolean;

    @Column({ type: 'enum', enum: LlmModelPurpose, default: LlmModelPurpose.CHAT })
    purpose: LlmModelPurpose;

    @Column({ type: 'integer', default: 0 })
    size: number;

    @CreateDateColumn({ nullable: true, default: null })
    createdAt: Date | null;

    @UpdateDateColumn({ nullable: true, default: null })
    updatedAi: Date | null;
}
