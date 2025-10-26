import { QueryResponse } from 'chromadb';

export function queryResponseConverter(queryResponse: QueryResponse): string[] {
    const context: (string | null)[] = queryResponse.documents.flat();
    return context.map((item) => item ?? '');
}
