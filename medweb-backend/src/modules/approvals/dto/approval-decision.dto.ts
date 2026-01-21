import { IsString, IsOptional } from 'class-validator';

export class ApprovalDecisionDto {
  @IsString()
  @IsOptional()
  note?: string;
}
