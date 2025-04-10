import { Injectable } from '@nestjs/common';
import { ChromaClient, Collection } from 'chromadb';
import { AddDocumentListDto } from '../dto/add-document.dto';
import { LlamaService } from '../llama/llama.service';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

@Injectable()
export class RagService {
    private client: ChromaClient;
    private collection: Collection;
    private textSplitter: RecursiveCharacterTextSplitter;

    constructor(private llamaService: LlamaService) {
        this.client = new ChromaClient({
            path: 'http://chromadb:8000',
        });

        this.textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
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
        const allDocuments: string[] = [];
        const allIds: string[] = [];

        for (const doc of addDocumentList.list) {
            const chunks = await this.textSplitter.splitText(doc.text);

            chunks.forEach((chunk, index) => {
                allDocuments.push(chunk);
                allIds.push(`${doc.id}_chunk${index}`);
            });
        }

        console.log('Put data to ChromaDB collection. Is: ', allIds);
        console.log('Documents: ', allDocuments);

        await this.collection.add({
            documents: allDocuments,
            ids: allIds,
        });
    }

    async query(query: string) {
        const queryContext = await this.collection.query({
            queryTexts: query,
            nResults: 2,
        });
        console.log('Collection response: ', queryContext);
        return this.llamaService.generateResponse(
            {
                question: query,
            },
            queryContext.documents,
        );
    }
}
