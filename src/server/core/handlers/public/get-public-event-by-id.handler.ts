import { createServerFn } from '@tanstack/react-start'
import { Effect } from 'effect'
import { EventService, EventServiceLayer } from '../../domain/events.service'
import { z } from 'zod'

export const getPublicEventByIdFn = createServerFn()
  .inputValidator(z.string())
  .handler(async ({ data: id }) => {
    const program = Effect.gen(function* () {
      const service = yield* EventService
      return yield* service.getPublicEventById(id)
    })

    const runnable = program.pipe(Effect.provide(EventServiceLayer))
    return Effect.runPromise(runnable)
  })
