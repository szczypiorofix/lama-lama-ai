import { Injectable } from '@nestjs/common';

import { ChromaService } from '../../services/chroma/chroma.service';

@Injectable()
export class DataService {
    constructor(private chromaService: ChromaService) {}

    public async putDataFileIntoDatabase(file: Express.Multer.File, documentId: string) {
        const content: string = file.buffer.toString('utf-8');
        const contents: string[] = [content.trim()];
        const documentIds: string[] = [documentId];
        return this.chromaService.addDocuments(contents, documentIds);
    }
}
