import { Injectable } from '@nestjs/common';
import { apiDetails } from '../shared/constants';
import { ApiDetails } from '../shared/models';

@Injectable()
export class ApiService {
    /**
     * Get the API details. Basic information about the API.
     *
     * @returns ApiDetails - API details
     */
    public getBasicDetails(): ApiDetails {
        return apiDetails;
    }

    // public async postLlamaQuestionWithContext(askDto: AskDto) {
    //     const filteredDocuments: ChromaCollectionDocuments =
    //         await this.ragService.retrieveContextFromDatabase(askDto);
    //     return this.llamaService.generateResponse(askDto, [filteredDocuments]);
    // }
}
