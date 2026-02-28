import { PrismaClient } from './generated/prisma/client.js'
import 'dotenv/config'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const connectionString = `${process.env.DATABASE_URL}`

declare global {
  var __prisma: PrismaClient | undefined
}

const adapter = new PrismaBetterSqlite3({ url: connectionString })
export const prisma = new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma
}
