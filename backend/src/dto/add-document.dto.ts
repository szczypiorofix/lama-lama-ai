import { IsString } from 'class-validator';

export class AddDocumentDto {
    @IsString()
    text: string[];
}
