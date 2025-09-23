import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TtsModel } from '../../entities';

@Injectable()
export class TtsModelService {
    constructor(
        @InjectRepository(TtsModel)
        private readonly repo: Repository<TtsModel>,
    ) {}

    public async findAll(): Promise<TtsModel[]> {
        return this.repo.find({ where: { isActive: true } });
    }

    public async findByVoiceId(voiceId: string): Promise<TtsModel | null> {
        return this.repo.findOne({ where: { voiceId } });
    }

    public async markAsDownloaded(id: number) {
        await this.repo.update(id, { downloaded: true });
    }

    public async create(data: Partial<TtsModel>) {
        return this.repo.save(this.repo.create(data));
    }
}
