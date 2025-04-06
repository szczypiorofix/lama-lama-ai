import { IsString } from 'class-validator';

export class AddDocumentDto {
    @IsString()
    id: string;

    @IsString()
    text: string;
}
