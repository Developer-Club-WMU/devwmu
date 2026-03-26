import { createServerFn } from '@tanstack/react-start'
import { Effect } from 'effect'
import { EventService, EventServiceLayer } from '../../domain/events.service'
import { z } from 'zod'
import { assertOfficerFn } from '@/server/helpers/route-protection'

export const toggleAttendanceFn = createServerFn()
  .inputValidator(z.object({
    attendeeId: z.string(),
    attended: z.boolean()
  }))
  .handler(async ({ data }) => {
    await assertOfficerFn()
    
    const program = Effect.gen(function* () {
      const service = yield* EventService
      return yield* service.toggleAttendance(data)
    })

    const runnable = program.pipe(Effect.provide(EventServiceLayer))
    return Effect.runPromise(runnable)
  })
