import { IsObject, IsOptional } from 'class-validator';

export class UpdateCaseDto {
  @IsObject()
  @IsOptional()
  answers?: Record<string, any>;
}
