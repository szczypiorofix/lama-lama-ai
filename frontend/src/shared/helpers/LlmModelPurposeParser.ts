import { LlmModelPurpose } from '../enums';

export function llmModelPurposeParser(purpose: LlmModelPurpose): string {
    switch (purpose) {
        case LlmModelPurpose.IMAGE_ANALYSIS:
            return 'image analysis';
        case LlmModelPurpose.CODE_ANALYSIS:
            return 'code analysis';
        default:
            return 'chat / general use';
    }
}
