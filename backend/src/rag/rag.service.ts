import {
    HttpException,
    HttpStatus,
    Injectable,
    Logger,
    OnModuleInit,
} from '@nestjs/common';
import type { QueryResponse } from 'chromadb';
import { ChromaClient, Collection } from 'chromadb';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { ConfigService } from '@nestjs/config';
import { AskDto } from '../dto/ask.dto';

export type ChromaCollectionDocuments = (string | null)[];

function filterDocumentsWithMaxDistance(
    query: QueryResponse,
    maxDistance: number,
): ChromaCollectionDocuments {
    const flatDocs: ChromaCollectionDocuments = query.documents.flat();
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
    private readonly DISTANCE_THRESHOLD_STRICT = 0.6;
    private readonly CHUNK_SIZE = 1000;
    private readonly CHUNK_OVERLAP = 200;

    constructor(private configService: ConfigService) {
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
            this.logger.error('Error initializing ChromaDB collection: ', err);
            throw new HttpException(
                'Error initializing ChromaDB collection: ' +
                    JSON.stringify(err),
                HttpStatus.NOT_FOUND,
            );
        }
    }

    public async addDocument(
        content: string,
        docIdPrefix: string,
    ): Promise<void> {
        const chunks = await this.textSplitter.splitText(content);
        const ids = chunks.map((_, i) => `${docIdPrefix}_chunk${i}`);

        await this.collection.add({
            documents: chunks,
            ids,
        });

        this.logger.log(`Added ${chunks.length} chunks to collection.`);
    }

    public async retrieveContextFromDatabase(
        askDto: AskDto,
    ): Promise<ChromaCollectionDocuments> {
        const queryContext = await this.collection.query({
            queryTexts: [askDto.question],
            nResults: 5,
        });

        this.logger.log('Query context: ', queryContext);

        const filteredDocuments: ChromaCollectionDocuments =
            filterDocumentsWithMaxDistance(
                queryContext,
                askDto.strictanswer
                    ? this.DISTANCE_THRESHOLD_STRICT
                    : this.DISTANCE_THRESHOLD,
            );

        this.logger.log('Filtered documents: ', filteredDocuments);

        return filteredDocuments;
    }
}
