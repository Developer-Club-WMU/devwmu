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
    return Effect.runPromise(runnable)
  })
