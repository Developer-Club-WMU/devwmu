import { prisma } from '@/db.js'

async function main() {
  console.log('🌱 Seeding database...')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
