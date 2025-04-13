import { Injectable, OnModuleInit } from '@nestjs/common';
import type { QueryResponse } from 'chromadb';
import { AddRecordsParams, ChromaClient, Collection } from 'chromadb';
import { LlamaService } from '../llama/llama.service';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { UuidService } from '../uuid/uuid.service';
import { ConfigService } from '@nestjs/config';

function filterDocumentsWithMaxDistance(
    query: QueryResponse,
    maxDistance: number,
): (string | null)[] {
    const flatDocs: (string | null)[] = query.documents.flat();
    const flatDistances: number[] = query.distances
        ? query.distances.flat()
        : [];
    return flatDocs.filter((doc, i) => flatDistances[i] < maxDistance);
}

@Injectable()
export class RagService implements OnModuleInit {
    private client: ChromaClient;
    private collection: Collection;
    private textSplitter: RecursiveCharacterTextSplitter;

    constructor(
        private llamaService: LlamaService,
        private uuidService: UuidService,
        private configService: ConfigService,
    ) {
        this.client = new ChromaClient({
            path: (this.configService.get('CHROMADB_URL') as string) || '',
        });

        this.textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });
    }

    async onModuleInit(): Promise<void> {
        try {
            this.collection = await this.client.getOrCreateCollection({
                name: 'my_collection',
            });
            console.log('ChromaDB collection initialized');
        } catch (err) {
            console.error('Error initializing ChromaDB collection', err);
        }
    }

    async addToCollection(content: string): Promise<boolean> {
        const allDocuments: string[] = [];
        const allIds: string[] = [];

        const chunks = await this.textSplitter.splitText(content);
        const generatedId: string = this.uuidService.generate();

        chunks.forEach((chunk, index) => {
            allDocuments.push(chunk);
            allIds.push(`${generatedId}_chunk${index}`);
        });

        const params: AddRecordsParams = {
            documents: allDocuments,
            ids: allIds,
        };

        await this.collection.add(params);
        return true;
    }

    async query(query: string) {
        const queryContext = await this.collection.query({
            queryTexts: [query],
            nResults: 5,
        });

        console.log('queryContext: ', queryContext);

        const maxDistance: number = 1.0;

        const filteredDocuments: (string | null)[] =
            filterDocumentsWithMaxDistance(queryContext, maxDistance);

        console.log(filteredDocuments);

        return this.llamaService.generateResponse({ question: query }, [
            filteredDocuments,
        ]);
    }
}
