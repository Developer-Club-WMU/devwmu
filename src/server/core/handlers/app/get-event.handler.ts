import { createServerFn } from '@tanstack/react-start'
import { Effect } from 'effect'
import { EventService, EventServiceLayer } from '../../domain/events.service'
import { z } from 'zod'

export const getEventFn = createServerFn()
  .inputValidator(z.string())
  .handler(async ({ data: id }) => {
    const program = Effect.gen(function* () {
      const service = yield* EventService
      return yield* service.getEventById(id)
    })

    const runnable = program.pipe(Effect.provide(EventServiceLayer))
    try {
      const result = await Effect.runPromise(runnable)
      return { ok: true as const, data: result }
    } catch (error: any) {
      return { ok: false as const, error: error?.message || 'Unknown error' }
    }
  })

export type GetEventFnShape = Awaited<ReturnType<typeof getEventFn>>
export type GetEventFnData = Extract<GetEventFnShape, { ok: true }>['data']
