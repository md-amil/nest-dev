import { IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @MinLength(1)
  content: string;

  @IsOptional()
  @Min(0)
  parent_id?: number;
}
