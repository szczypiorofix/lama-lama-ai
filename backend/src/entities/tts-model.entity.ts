import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tts_models')
export class TtsModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ name: 'model_path' })
    modelPath: string;

    @Column({ name: 'language_code', nullable: true })
    languageCode: string;

    @Column({ name: 'voice_id', unique: true })
    voiceId: string;

    @Column({ default: false })
    downloaded: boolean;

    @Column({ name: 'download_url' })
    downloadUrl: string;

    @Column({ name: 'local_path' })
    localPath: string;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
