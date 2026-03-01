import { createServerFn } from '@tanstack/react-start'
import { Effect } from 'effect'
import { EventService, EventServiceLayer } from '../../domain/events.service'

export const getPublicEventsFn = createServerFn().handler(async () => {
  const program = Effect.gen(function* () {
    const service = yield* EventService
    return yield* service.getPublicEvents()
  })

  const runnable = program.pipe(Effect.provide(EventServiceLayer))
  return Effect.runPromise(runnable)
})
