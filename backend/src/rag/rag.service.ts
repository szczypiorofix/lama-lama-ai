import { Injectable } from '@nestjs/common';
import { Chroma } from '@langchain/community/vectorstores/chroma';
import { OllamaEmbeddings } from '@langchain/community/embeddings/ollama';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

@Injectable()
export class RagService {
    private vectorStore: Chroma;

    async initVectorStore(docsPath: string) {
        const loader = new TextLoader(docsPath);
        const rawDocs = await loader.load();

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });
        const docs = await splitter.splitDocuments(rawDocs);

        this.vectorStore = await Chroma.fromDocuments(
            docs,
            new OllamaEmbeddings({
                model: 'mistral',
                baseUrl: 'http://localhost:11434',
            }),
            { collectionName: 'my-docs' },
        );
    }

    async query(query: string) {
        const results = await this.vectorStore.similaritySearch(query, 3);
        return results.map((doc) => doc.pageContent);
    }
}
