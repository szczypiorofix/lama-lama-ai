export interface OllamaStreamResponse {
    message: string;
    type: 'answer' | 'sources';
    sources: string[];
}
