import { prisma } from '@/db.js'

async function main() {
  console.log('🌱 Seeding database...')

  // Create or update a dummy user
  const user = await prisma.user.upsert({
    where: { email: 'admin@devwmu.org' },
    update: {},
    create: {
      id: 'user_clon123456789',
      name: 'Admin User',
      email: 'admin@devwmu.org',
      emailVerified: true,
    },
  })

  console.log(`👤 Created user: ${user.name}`)

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
      createdById: user.id,
      capacity: 150,
    },
  })

  console.log(`🎉 Seeded event: ${event.title}`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
