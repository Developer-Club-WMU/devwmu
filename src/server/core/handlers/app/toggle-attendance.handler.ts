import { createServerFn } from '@tanstack/react-start'
import { Effect, Layer } from 'effect'
import { EventService, EventServiceLayer } from '../../domain/events.service'
import { ProgressionService, ProgressionServiceLayer } from '../../domain/progression.service'
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
      const eventService = yield* EventService
      const progressionService = yield* ProgressionService
      
      const attendee = yield* eventService.toggleAttendance(data)
      
      if (data.attended) {
        yield* progressionService.awardAttendanceXP({
          eventId: attendee.eventId,
          userId: attendee.userId
        })
      }
      
      return attendee
    })

    const combinedLayer = Layer.merge(EventServiceLayer, ProgressionServiceLayer)
    const runnable = program.pipe(Effect.provide(combinedLayer))
    return Effect.runPromise(runnable)
  })
