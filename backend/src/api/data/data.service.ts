import { Injectable } from '@nestjs/common';
import { RagService } from 'src/rag/rag.service';
import { UuidService } from '../../uuid/uuid.service';

@Injectable()
export class DataService {
    constructor(
        private ragService: RagService,
        private uuidService: UuidService,
    ) {}

    public async putDataFileIntoDatabase(file: Express.Multer.File) {
        const content: string = file.buffer.toString();
        const docId = this.uuidService.generate();
        return await this.ragService.addDocument(content, docId);
    }
}
