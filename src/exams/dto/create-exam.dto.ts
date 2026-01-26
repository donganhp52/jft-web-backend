import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateExamDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsInt()
  @Min(1)
  timeLimit: number;
}
