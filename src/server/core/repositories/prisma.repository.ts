import { prisma } from '@/db'
import { Context, Layer } from 'effect'
import type { PrismaClient } from 'generated/client'

export class DbClient extends Context.Tag('DbClient')<
  DbClient,
  PrismaClient
>() {}

export const DbClientLive = Layer.succeed(DbClient, prisma)
