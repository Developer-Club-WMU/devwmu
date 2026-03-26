import { prisma } from '@/db.js'
import { faker } from '@faker-js/faker'

async function main() {
  console.log('🌱 Seeding database...')

  // Create or update an admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@devwmu.org' },
    update: {
      role: 'admin'
    },
    create: {
      id: 'user_admin_001',
      name: 'Admin User',
      email: 'admin@devwmu.org',
      emailVerified: true,
      role: 'admin',
      title: 'ROOKIE'
    },
  })

  console.log(`👤 Admin user verified: ${admin.name}`)

  // Create or update a regular user
  const demoUser = await prisma.user.upsert({
    where: { email: 'member@devwmu.org' },
    update: {
      title: 'ROOKIE'
    },
    create: {
      id: 'user_member_001',
      name: 'Demo Member',
      email: 'member@devwmu.org',
      emailVerified: true,
      role: 'user',
      title: 'ROOKIE'
    },
  })

  console.log(`👤 Demo member verified: ${demoUser.name}`)

  // Seed 50 fake members
  console.log('👥 Generating 50 fake members...')
  const fakeUsersData = Array.from({ length: 50 }).map(() => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    emailVerified: true,
    role: faker.helpers.arrayElement(['user', 'user', 'user', 'admin']), // mostly users
    createdAt: faker.date.past({ years: 1 }),
    banned: faker.datatype.boolean({ probability: 0.1 }),
    banReason: null as string | null,
    level: faker.number.int({ min: 1, max: 20 }),
    xp: faker.number.int({ min: 0, max: 10000 }),
    title: faker.helpers.arrayElement([
      'ROOKIE',
      'APPRENTICE',
      'NINJA',
      'ARCHITECT',
      'WIZARD'
    ])
  })).map(u => u.banned ? { ...u, banReason: 'Violation of Terms of Service' } : u)

  // Use upsert in a loop for fake members since SQLite doesn't support createMany
  await Promise.all(
    fakeUsersData.map(userData => 
      prisma.user.upsert({
        where: { email: userData.email },
        update: {},
        create: {
          ...userData,
          updatedAt: new Date()
        }
      })
    )
  )

  console.log(`✅ Seeded 50 fake members.`)

  // Create a sample event with markdown
  const event = await prisma.event.create({
    data: {
      title: 'Dev WMU Spring Hackathon 2026',
      description: 'The biggest coding event of the semester! Join us for 24 hours of building, learning, and fun.',
      content: `
# Welcome to the Spring Hackathon!

We are excited to host the largest student-led hackathon at Western Michigan University.

## 📅 Schedule

- **10:00 AM**: Opening Ceremony
- **11:00 AM**: Hacking Begins
- **12:30 PM**: Lunch
- **...**

## 🏆 Prizes

1. **First Place**: $500 + Mechanical Keyboards
2. **Second Place**: $250 + Raspberry Pis
3. **Third Place**: $100 + Swag Bags

## 🔗 Resources

- [Official Rules](https://devwmu.org/hackathon-rules)
- [Discord Server](https://discord.gg/devwmu)

### Happy Coding! 🚀
      `.trim(),
      location: 'Parkview Campus, Floyd Hall',
      startTime: new Date('2026-04-15T10:00:00Z'),
      endTime: new Date('2026-04-16T10:00:00Z'),
      status: 'PUBLISHED',
      isPublic: true,
      createdById: admin.id,
      capacity: 150,
    },
  })

  console.log(`🎉 Seeded event: ${event.title}`)

  // Seed some attendees
  const allUsers = await prisma.user.findMany({ take: 20 })
  await Promise.all(
    allUsers.map(u => 
      prisma.eventAttendee.upsert({
        where: { eventId_userId: { eventId: event.id, userId: u.id } },
        update: {},
        create: {
          userId: u.id,
          eventId: event.id,
        }
      })
    )
  )
  console.log(`🎟️ Seeded 20 attendees for the hackathon.`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
