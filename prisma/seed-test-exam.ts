/**
 * Seed script to create test exam data for UC-02 testing
 *
 * Run: npx ts-node prisma/seed-test-exam.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Get existing test user
  const testUser = await prisma.user.findUnique({
    where: { email: 'testuser2@example.com' },
  });

  if (!testUser) {
    console.error('❌ Test user not found. Please register first!');
    return;
  }

  console.log(`✅ Found user: ${testUser.email} (${testUser.id})`);

  // 2. Create exam
  const exam = await prisma.exam.create({
    data: {
      title: 'Test Exam for UC-02',
      description: 'Sample exam with 3 questions',
      timeLimit: 1800, // 30 minutes
      status: 'PUBLISHED',
      createdBy: testUser.id,
    },
  });

  console.log(`✅ Created exam: ${exam.id}`);

  // 3. Create questions
  const questions = await Promise.all([
    prisma.question.create({
      data: {
        contentHtml: '<p>What is 2 + 2?</p>',
        sectionType: 'SCRIPT_VOCABULARY',
        status: 'ACTIVE',
        createdBy: testUser.id,
      },
    }),
    prisma.question.create({
      data: {
        contentHtml: '<p>What is the capital of France?</p>',
        sectionType: 'READING',
        status: 'ACTIVE',
        createdBy: testUser.id,
      },
    }),
    prisma.question.create({
      data: {
        contentHtml: '<p>How do you say "Hello" in Japanese?</p>',
        sectionType: 'CONVERSATION_EXPRESSION',
        status: 'ACTIVE',
        createdBy: testUser.id,
      },
    }),
  ]);

  console.log(`✅ Created ${questions.length} questions`);

  // 4. Create options for each question
  const optionsQ1 = await Promise.all([
    prisma.questionOption.create({
      data: {
        questionId: questions[0].id,
        contentHtml: '<p>3</p>',
        isCorrect: false,
        orderNo: 1,
      },
    }),
    prisma.questionOption.create({
      data: {
        questionId: questions[0].id,
        contentHtml: '<p>4</p>',
        isCorrect: true,
        orderNo: 2,
      },
    }),
    prisma.questionOption.create({
      data: {
        questionId: questions[0].id,
        contentHtml: '<p>5</p>',
        isCorrect: false,
        orderNo: 3,
      },
    }),
  ]);

  const optionsQ2 = await Promise.all([
    prisma.questionOption.create({
      data: {
        questionId: questions[1].id,
        contentHtml: '<p>London</p>',
        isCorrect: false,
        orderNo: 1,
      },
    }),
    prisma.questionOption.create({
      data: {
        questionId: questions[1].id,
        contentHtml: '<p>Paris</p>',
        isCorrect: true,
        orderNo: 2,
      },
    }),
    prisma.questionOption.create({
      data: {
        questionId: questions[1].id,
        contentHtml: '<p>Berlin</p>',
        isCorrect: false,
        orderNo: 3,
      },
    }),
  ]);

  const optionsQ3 = await Promise.all([
    prisma.questionOption.create({
      data: {
        questionId: questions[2].id,
        contentHtml: '<p>Konnichiwa</p>',
        isCorrect: true,
        orderNo: 1,
      },
    }),
    prisma.questionOption.create({
      data: {
        questionId: questions[2].id,
        contentHtml: '<p>Annyeong</p>',
        isCorrect: false,
        orderNo: 2,
      },
    }),
    prisma.questionOption.create({
      data: {
        questionId: questions[2].id,
        contentHtml: '<p>Ni Hao</p>',
        isCorrect: false,
        orderNo: 3,
      },
    }),
  ]);

  console.log(`✅ Created options for all questions`);

  // 5. Link questions to exam
  await prisma.examQuestion.createMany({
    data: [
      {
        examId: exam.id,
        questionId: questions[0].id,
        sectionType: 'SCRIPT_VOCABULARY',
        orderNo: 1,
      },
      {
        examId: exam.id,
        questionId: questions[1].id,
        sectionType: 'READING',
        orderNo: 2,
      },
      {
        examId: exam.id,
        questionId: questions[2].id,
        sectionType: 'CONVERSATION_EXPRESSION',
        orderNo: 3,
      },
    ],
  });

  console.log(`✅ Linked questions to exam`);

  // 6. Print summary
  console.log('\n📊 Summary:');
  console.log(`Exam ID: ${exam.id}`);
  console.log(`Question 1 ID: ${questions[0].id}`);
  console.log(`  - Option A: ${optionsQ1[0].id} (3)`);
  console.log(`  - Option B: ${optionsQ1[1].id} (4) ✓`);
  console.log(`  - Option C: ${optionsQ1[2].id} (5)`);
  console.log(`Question 2 ID: ${questions[1].id}`);
  console.log(`  - Option A: ${optionsQ2[0].id} (London)`);
  console.log(`  - Option B: ${optionsQ2[1].id} (Paris) ✓`);
  console.log(`  - Option C: ${optionsQ2[2].id} (Berlin)`);
  console.log(`Question 3 ID: ${questions[2].id}`);
  console.log(`  - Option A: ${optionsQ3[0].id} (Konnichiwa) ✓`);
  console.log(`  - Option B: ${optionsQ3[1].id} (Annyeong)`);
  console.log(`  - Option C: ${optionsQ3[2].id} (Ni Hao)`);

  console.log('\n✅ Seed completed!\n');
  console.log('🚀 Test Postman với:');
  console.log(`   POST /exams/${exam.id}/sessions`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
