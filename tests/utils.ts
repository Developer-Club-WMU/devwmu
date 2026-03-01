import { mockDeep, type DeepMockProxy } from 'vitest-mock-extended'
import type { PrismaClient } from 'generated/client'
import { Layer } from 'effect'
import { DbClient } from '@/server/core/repositories/prisma.repository'

export const prismaMock: DeepMockProxy<PrismaClient> = mockDeep<PrismaClient>()

export const MockDbClientLayer = Layer.succeed(
  DbClient,
  prismaMock as unknown as PrismaClient,
)
