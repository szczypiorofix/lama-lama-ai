import { Injectable } from '@nestjs/common';
import { Ollama } from '@langchain/community/llms/ollama';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LlmService {
    private llm: Ollama;

    constructor(private readonly configService: ConfigService) {
        this.llm = new Ollama({
            model: (this.configService.get('OLLAMA_MODEL') as string) || '',
            baseUrl: (this.configService.get('OLLAMA_API_URL') as string) || '',
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
