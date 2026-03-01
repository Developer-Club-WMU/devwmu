import { describe, expect, it, beforeEach } from 'vitest'
import { Effect, Layer } from 'effect'
import {
  EventService,
  EventServiceLive,
} from '../src/server/core/domain/events.service'
import { DbClient } from '../src/server/core/repositories/prisma.repository'
import { PrismaError } from '../src/server/core/shared/errors'
import { prismaMock } from './utils'
import type { EventStatus } from 'generated/client'
import { mockReset } from 'vitest-mock-extended'

describe('EventService', () => {
  beforeEach(() => {
    mockReset(prismaMock)
  })

  const validEventData = {
    title: 'Test Event',
    description: null,
    content: null,
    location: null,
    startTime: new Date(),
    endTime: new Date(Date.now() + 3600000), // 1 hour later
    status: 'DRAFT' as EventStatus,
    capacity: null,
    isPublic: true,
    createdById: 'user-1',
  }

  const TestLayer = EventServiceLive.pipe(
    Layer.provide(Layer.succeed(DbClient, prismaMock)),
  )

  it('should successfully create an event', async () => {
    prismaMock.event.create.mockResolvedValue({
      id: 'event-1',
      ...validEventData,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const program = Effect.gen(function* () {
      const service = yield* EventService
      return yield* service.upsertEvent({
        data: validEventData,
      })
    }).pipe(Effect.provide(TestLayer))

    const result = await Effect.runPromise(program)

    expect(prismaMock.event.create).toHaveBeenCalledTimes(1)
    expect(prismaMock.event.create).toHaveBeenCalledWith({
      data: validEventData,
    })
    expect(result.id).toBe('event-1')
  })

  it('should map Prisma errors into PrismaError', async () => {
    prismaMock.event.create.mockRejectedValue(
      new PrismaError({ message: 'DB failure' }),
    )

    const program = Effect.gen(function* () {
      const service = yield* EventService
      return yield* service.upsertEvent({
        data: validEventData,
      })
    }).pipe(Effect.provide(TestLayer))

    const exit = await Effect.runPromiseExit(program)

    expect(exit._tag).toBe('Failure')

    if (exit._tag === 'Failure') {
      const cause = exit.cause
      expect(cause._tag).toBe('Fail')

      if (cause._tag === 'Fail') {
        expect(cause.error).toBeInstanceOf(PrismaError)
        expect(cause.error.message).toBe('Failed to upsert event')
      }
    }
  })
})
