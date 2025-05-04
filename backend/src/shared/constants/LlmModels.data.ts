import { LlmModelEntity } from '../../orm';

export const DEFAULT_LLM_MODELS: LlmModelEntity[] = [
    {
        id: 1,
        name: 'tinyllama',
        version: 'latest',
        downloaded: false,
        size: 0,
        createdAt: null,
        updatedAi: null,
    },
    {
        id: 2,
        name: 'gemma3',
        version: '1b',
        downloaded: false,
        size: 0,
        createdAt: null,
        updatedAi: null,
    },
    {
        id: 3,
        name: 'llava',
        version: '7b',
        downloaded: false,
        size: 0,
        createdAt: null,
        updatedAi: null,
    },
    {
        id: 4,
        name: 'gemma3',
        version: '4b',
        downloaded: false,
        size: 0,
        createdAt: null,
        updatedAi: null,
    },
];
