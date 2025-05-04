import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('documents')
export class DocumentEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    source: string;

    @Column('text')
    description: string;

    @CreateDateColumn()
    createdAt: Date;
}
