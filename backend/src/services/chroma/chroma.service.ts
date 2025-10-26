import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChromaClient, Collection, OllamaEmbeddingFunction, QueryResponse } from 'chromadb';

import { ChatQuestionDto } from '../../dto/chatQuestion.dto';

function filterDocumentsWithMaxDistance(query: QueryResponse, maxDistance: number): string[] {
    const flatDocs: (string | null)[] = query.documents.flat();
    const flatDistances: (number | null)[] = query.distances ? query.distances.flat() : [];
    return flatDocs
        .filter((doc, i) => flatDistances[i] !== null && flatDistances[i] < maxDistance)
        .map((doc) => doc || '');
}

@Injectable()
export class ChromaService implements OnModuleInit {
    private readonly logger: Logger = new Logger(ChromaService.name);

    private chromaClient: ChromaClient;
    private collection: Collection;

    private readonly OLLAMA_URL: string;
    private readonly EMBEDDING_MODEL: string;

    private readonly DISTANCE_THRESHOLD = 1.0;
    private readonly DISTANCE_THRESHOLD_STRICT = 0.65;

    private readonly CHROMA_URL: string;
    private readonly COLLECTION_NAME = 'my_collection';

    constructor(private configService: ConfigService) {
        this.OLLAMA_URL = this.configService.get<string>('OLLAMA_API_URL') || '';
        this.EMBEDDING_MODEL = this.configService.get<string>('EMBEDDING_MODEL') || 'nomic-embed-text:latest';
    }

    async onModuleInit() {
        this.chromaClient = new ChromaClient({ path: this.CHROMA_URL });
        try {
            const ollamaEmbedder = new OllamaEmbeddingFunction({
                url: this.OLLAMA_URL,
                model: this.EMBEDDING_MODEL,
            });

            this.collection = await this.chromaClient.getOrCreateCollection({
                name: this.COLLECTION_NAME,
                embeddingFunction: ollamaEmbedder,
            });

            this.logger.log(
                `Connected successfully to Ollama and Chroma (using embedding model: ${this.EMBEDDING_MODEL}).`,
            );
        } catch (error) {
            this.logger.error('Cannot connect to Ollama and Chroma. ', error);
        }
    }

    async addDocuments(content: string, documentId: string): Promise<void> {
        await this.collection.add({
            documents: [content],
            ids: [documentId],
        });

        this.logger.log('Added document(s).');
    }

    async queryDocuments(chatQuestion: ChatQuestionDto): Promise<string[]> {
        if (!this.collection) {
            this.logger.error('Chroma collection was not initialized.');
            return [];
        }

        const queryContext: QueryResponse = await this.collection.query({
            queryTexts: [chatQuestion.question],
            nResults: 5,
        });

        const context: string[] = filterDocumentsWithMaxDistance(
            queryContext,
            chatQuestion.strictAnswer ? this.DISTANCE_THRESHOLD_STRICT : this.DISTANCE_THRESHOLD,
        );

        this.logger.log(`Found ${context.length} documents in ChromaDB for context.`);

        return context;
    }
}
