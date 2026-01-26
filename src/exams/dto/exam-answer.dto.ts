import { IsString } from 'class-validator';

export class ExamAnswerDto {
  @IsString()
  questionId: string;

  @IsString()
  selectedOptionId: string;
}
