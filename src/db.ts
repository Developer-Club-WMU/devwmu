import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from 'generated/client'

const connectionString = `${process.env.DATABASE_URL}`

declare global {
  var __prisma: PrismaClient | undefined
}

const adapter = new PrismaPg({ connectionString })
export const prisma = new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma
}
