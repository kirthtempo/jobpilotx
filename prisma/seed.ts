import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seeding...')

  // Clear existing data first
  console.log('🧹 Cleaning existing data...')
  await prisma.application.deleteMany({})
  await prisma.job.deleteMany({})
  await prisma.user.deleteMany({})

  // 1. Create some users using upsert to handle duplicates
  const user1 = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      email: 'alice@example.com',
      name: 'Alice Johnson',
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      email: 'bob@example.com',
      name: 'Bob Smith',
    },
  })

  const user3 = await prisma.user.upsert({
    where: { email: 'charlie@example.com' },
    update: {},
    create: {
      email: 'charlie@example.com',
      name: 'Charlie Brown',
    },
  })

  console.log('✅ Created users')

  // 2. Create some jobs (linked to users as job posters)
  const job1 = await prisma.job.create({
    data: {
      title: 'Frontend Developer',
      description: 'Work on exciting UI projects with React and TypeScript. We are looking for a passionate developer to join our team.',
      company: 'Tech Corp',
      userId: user1.id,
    },
  })

  const job2 = await prisma.job.create({
    data: {
      title: 'Backend Developer',
      description: 'Build scalable APIs using Node.js, Express, and Prisma. Experience with PostgreSQL required.',
      company: 'Dev Solutions',
      userId: user2.id,
    },
  })

  const job3 = await prisma.job.create({
    data: {
      title: 'Full Stack Developer',
      description: 'Work on both frontend and backend technologies. React, Node.js, and database experience preferred.',
      company: 'StartupXYZ',
      userId: user3.id,
    },
  })

  console.log('✅ Created jobs')

  // 3. Create some applications
  await prisma.application.create({
    data: {
      coverLetter: 'I am passionate about frontend development and have 3 years of experience with React and TypeScript!',
      userId: user2.id, // Bob applies to Alice's job
      jobId: job1.id,
    },
  })

  await prisma.application.create({
    data: {
      coverLetter: 'I have strong experience with backend systems and would love to contribute to your team.',
      userId: user1.id, // Alice applies to Bob's job
      jobId: job2.id,
    },
  })

  await prisma.application.create({
    data: {
      coverLetter: 'As a full-stack developer, I believe I would be a great fit for this remote position.',
      userId: user1.id, // Alice also applies to Charlie's job
      jobId: job3.id,
    },
  })

  await prisma.application.create({
    data: {
      coverLetter: 'I am excited about the opportunity to work with modern technologies in a startup environment.',
      userId: user2.id, // Bob also applies to Charlie's job
      jobId: job3.id,
    },
  })

  console.log('✅ Created applications')
  console.log('🎉 Database seeding completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error during seeding:', e)
    await prisma.$disconnect()
    process.exit(1)
  })