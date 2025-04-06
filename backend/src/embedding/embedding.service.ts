import { Injectable } from '@nestjs/common';
import * as tf from '@tensorflow/tfjs-node';
import * as use from '@tensorflow-models/universal-sentence-encoder';

@Injectable()
export class EmbeddingService {
    private model: use.UniversalSentenceEncoder;

    constructor() {
        this.loadModel();
    }

    async loadModel() {
        this.model = await use.load();
    }

    async generateEmbedding(text: string): Promise<number[]> {
        const embeddings = await this.model.embed([text]);
        return embeddings.arraySync()[0];
    }
}
