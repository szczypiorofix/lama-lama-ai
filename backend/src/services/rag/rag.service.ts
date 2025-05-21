import { HttpException, HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatQuestionDto } from '../../dto/chatQuestion.dto';
import { ChromaClient, Collection, QueryResponse } from 'chromadb';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { UuidService } from '../uuid/uuid.service';

export type ChromaCollectionDocuments = (string | null)[];

function filterDocumentsWithMaxDistance(query: QueryResponse, maxDistance: number): string[] {
    const flatDocs: ChromaCollectionDocuments = query.documents.flat();
    const flatDistances: number[] = query.distances ? query.distances.flat() : [];
    return flatDocs.filter((doc, i) => flatDistances[i] < maxDistance).map((doc) => doc || '');
}

@Injectable()
export class RagService implements OnModuleInit {
    private client: ChromaClient;
    private collection: Collection;
    private textSplitter: RecursiveCharacterTextSplitter;

    private readonly logger = new Logger(RagService.name);
    private readonly COLLECTION_NAME = 'my_collection';
    private readonly DISTANCE_THRESHOLD = 1.0;
    private readonly DISTANCE_THRESHOLD_STRICT = 0.65;
    private readonly CHUNK_SIZE = 1000;
    private readonly CHUNK_OVERLAP = 200;
    private readonly CHROMA_DB_URL: string;

    constructor(
        private configService: ConfigService,
        private uuidService: UuidService,
    ) {
        this.CHROMA_DB_URL = this.configService.get<string>('CHROMADB_URL') || '';
        this.client = new ChromaClient({ path: this.CHROMA_DB_URL });

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
            this.logger.error('Error initializing ChromaDB collection: ', err);
            throw new HttpException(
                'Error initializing ChromaDB collection: ' + JSON.stringify(err),
                HttpStatus.NOT_FOUND,
            );
        }
    }

    public async addDocument(content: string, documentId: string): Promise<void> {
        const normalizedDocumentId: string = documentId
            ? this.normalizeDocumentId(documentId)
            : this.uuidService.generate();

        this.logger.log(`Set document ID to ${normalizedDocumentId}.`);

        const chunks = await this.textSplitter.splitText(content);
        const ids = chunks.map((_, i) => `${normalizedDocumentId}_${i}`);

        await this.collection.add({
            documents: chunks,
            ids,
        });

        this.logger.log(`Added ${chunks.length} chunks to collection.`);
    }

    public async retrieveContextFromDatabase(chatQuestion: ChatQuestionDto): Promise<string[]> {
        const queryContext = await this.collection.query({
            queryTexts: [chatQuestion.question],
            nResults: 5,
        });

        return filterDocumentsWithMaxDistance(
            queryContext,
            chatQuestion.strictAnswer ? this.DISTANCE_THRESHOLD_STRICT : this.DISTANCE_THRESHOLD,
        );
    }

    private normalizeDocumentId(name: string): string {
        const sanitized = name
            .toLowerCase()
            .replace(/\s+/g, '_')
            .replace(/[^a-z0-9_]/g, '');
        const suffix = this.uuidService.generate().split('-').pop();
        return `${sanitized}_${suffix}`;
    }
}
