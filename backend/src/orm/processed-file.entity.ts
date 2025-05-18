import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('processed_files')
export class ProcessedFile {
    @PrimaryGeneratedColumn()
    id: number;

    @Index({ unique: true })
    @Column()
    filename: string;

    @Column()
    size: number;

    @CreateDateColumn()
    processedAt: Date;
}
