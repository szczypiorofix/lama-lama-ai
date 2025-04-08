import { Injectable } from '@nestjs/common';
import { Ollama } from '@langchain/community/llms/ollama';

@Injectable()
export class LlmService {
    private llm: Ollama;

    constructor() {
        this.llm = new Ollama({
            model: 'mistral',
            baseUrl: 'http://localhost:11434',
        });
    }

    async generateResponse(prompt: string, context: string[]) {
        const augmentedPrompt = `
            Kontekst: ${context.join('\n')}
            Pytanie: ${prompt}
            Odpowiedź:`;
        return this.llm.invoke(augmentedPrompt);
    }
}
