import { Injectable } from '@nestjs/common';

import { RagService } from '../../services';

@Injectable()
export class DataService {
    constructor(private ragService: RagService) {}

    public async putDataFileIntoDatabase(file: Express.Multer.File, documentId: string) {
        const content: string = file.buffer.toString('utf-8');
        return await this.ragService.addDocument(content, documentId);
    }
}
