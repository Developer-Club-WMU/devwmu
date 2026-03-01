import { createServerFn } from '@tanstack/react-start'
import { Effect } from 'effect'
import { EventService, EventServiceLayer } from '../../domain/events.service'

export const listEventsFn = createServerFn().handler(async () => {
  const program = Effect.gen(function* () {
    const service = yield* EventService
    return yield* service.listEvents()
  })

  const runnable = program.pipe(Effect.provide(EventServiceLayer))
  return Effect.runPromise(runnable)
})
