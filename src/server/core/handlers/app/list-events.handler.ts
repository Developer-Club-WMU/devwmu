import { createServerFn } from '@tanstack/react-start'
import { Effect } from 'effect'
import { EventService, EventServiceLayer } from '../../domain/events.service'
import { z } from 'zod'

export const listEventsFn = createServerFn()
  .inputValidator(z.object({ userId: z.string().optional() }).optional())
  .handler(async ({ data }) => {
    const program = Effect.gen(function* () {
      const service = yield* EventService
      return yield* service.listEvents(data)
    })

    const runnable = program.pipe(Effect.provide(EventServiceLayer))
    try {
      const result = await Effect.runPromise(runnable)
      return { ok: true as const, data: result }
    } catch (error: any) {
      return { ok: false as const, error: error?.message || 'Unknown error' }
    }
  })

export type ListEventsFnShape = Awaited<ReturnType<typeof listEventsFn>>
export type ListEventsFnData = Extract<ListEventsFnShape, { ok: true }>['data']
