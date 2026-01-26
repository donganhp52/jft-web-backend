import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { SubmitExamDto } from './dto/submit-exam.dto';
import { Prisma, ExamSessionStatus } from '@prisma/client';

@Injectable()
export class ExamsService {
  constructor(private readonly prisma: PrismaService) {}

  createExam(creatorId: string, createExamDto: CreateExamDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    return this.prisma.exam.create({
      data: {
        ...createExamDto,
        createdBy: creatorId,
        status: 'DRAFT',
      },
    });
  }

  publishExam(examId: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return this.prisma.exam.update({
      where: { id: examId },
      data: { status: 'PUBLISHED' },
    });
  }

  submitExam(userId: string, examId: string, submitExamDto: SubmitExamDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const answersJson: Prisma.JsonArray = submitExamDto.answers.map(
      (answer) => ({
        questionId: answer.questionId,
        selectedOptionId: answer.selectedOptionId,
      }),
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.prisma.examSession.create({
      data: {
        userId,
        examId,
        answers: answersJson,
        status: ExamSessionStatus.SUBMITTED,
        submittedAt: new Date(),
      },
    });
  }

  getPublishedExams(examId: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    return this.prisma.exam.findFirst({
      where: { id: examId, status: 'PUBLISHED' },
    });
  }
}
