import { Injectable } from '@nestjs/common';
import { ChromaClient, Collection } from 'chromadb';
import { AddDocumentDto, AddDocumentListDto } from '../dto/add-document.dto';
import { LlamaService } from '../llama/llama.service';

@Injectable()
export class RagService {
    private client: ChromaClient;
    private collection: Collection;

    constructor(private llamaService: LlamaService) {
        this.client = new ChromaClient({
            path: 'http://chromadb:8000',
        });
        this.initiateCollection()
            .then(() => console.log('Collection initialized'))
            .catch((err) =>
                console.error(
                    'An error occurred while initializing collection',
                    err,
                ),
            );
    }

    async initiateCollection() {
        this.collection = await this.client.getOrCreateCollection({
            name: 'my_collection',
        });
    }

    async addToCollection(addDocumentList: AddDocumentListDto) {
        const documents: string[] = addDocumentList.list.map(
            (doc: AddDocumentDto) => doc.text,
        );
        const ids: string[] = addDocumentList.list.map((doc: AddDocumentDto) => doc.id);
        await this.collection.add({
            documents,
            ids,
        });
    }

    async query(query: string) {
        const queryContext = await this.collection.query({
            queryTexts: query,
            nResults: 2,
        });
        return this.llamaService.generateResponse(
            {
                question: query,
            },
            queryContext.documents,
        );
    }
}
