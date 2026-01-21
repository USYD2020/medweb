import { IsUUID, IsOptional } from 'class-validator';

export class CreateCaseDto {
  @IsUUID()
  @IsOptional()
  formVersionId?: string;
}
