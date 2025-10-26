import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChromaClient, Collection, OllamaEmbeddingFunction } from 'chromadb';

@Injectable()
export class ChromaService implements OnModuleInit {
    private readonly logger = new Logger(ChromaService.name);

    private chromaClient: ChromaClient;
    private collection: Collection;

    private readonly OLLAMA_URL: string;
    private readonly EMBEDDING_MODEL: string;

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

    async addDocuments(content: string, documentId: string) {
        await this.collection.add({
            documents: [content],
            ids: [documentId],
        });

        this.logger.log('Added document(s).');
    }

    async queryDocuments(queryText: string) {
        if (!this.collection) {
            throw new Error('Chroma collection was not initialized.');
        }

        const results = await this.collection.query({
            queryTexts: [queryText],
            nResults: 1,
        });

        this.logger.log(results);

        return results;
    }
}
