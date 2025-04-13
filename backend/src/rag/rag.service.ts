import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import type { QueryResponse } from 'chromadb';
import { ChromaClient, Collection } from 'chromadb';
import { LlamaService } from '../llama/llama.service';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
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

    private readonly logger = new Logger(RagService.name);
    private readonly COLLECTION_NAME = 'my_collection';
    private readonly DISTANCE_THRESHOLD = 1.0;
    private readonly CHUNK_SIZE = 1000;
    private readonly CHUNK_OVERLAP = 200;

    constructor(
        private llamaService: LlamaService,
        private configService: ConfigService,
    ) {
        this.client = new ChromaClient({
            path: this.configService.get<string>('CHROMADB_URL') || '',
        });

        this.textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: this.CHUNK_SIZE,
            chunkOverlap: this.CHUNK_OVERLAP,
        });
    }

    async onModuleInit(): Promise<void> {
        try {
            this.collection = await this.client.getOrCreateCollection({
                name: this.COLLECTION_NAME,
            });
            this.logger.log('ChromaDB collection initialized');
        } catch (err) {
            this.logger.error('Error initializing ChromaDB collection', err);
        }
    }

    async addDocument(content: string, docIdPrefix: string): Promise<void> {
        const chunks = await this.textSplitter.splitText(content);
        const ids = chunks.map((_, i) => `${docIdPrefix}_chunk${i}`);

        await this.collection.add({
            documents: chunks,
            ids,
        });

        this.logger.log(`Added ${chunks.length} chunks to collection.`);
    }

    async query(query: string) {
        const queryContext = await this.collection.query({
            queryTexts: [query],
            nResults: 5,
        });

        this.logger.log('Query context: ', queryContext);

        const filteredDocuments: (string | null)[] =
            filterDocumentsWithMaxDistance(
                queryContext,
                this.DISTANCE_THRESHOLD,
            );

        this.logger.log('Filtered documents: ', filteredDocuments);

        return this.llamaService.generateResponse({ question: query }, [
            filteredDocuments,
        ]);
    }
}
