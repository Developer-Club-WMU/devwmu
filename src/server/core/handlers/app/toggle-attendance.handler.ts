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
    try {
      const result = await Effect.runPromise(runnable)
      return { ok: true as const, data: result }
    } catch (error: any) {
      return { ok: false as const, error: error?.message || 'Unknown error' }
    }
  })

export type ToggleAttendanceFnShape = Awaited<ReturnType<typeof toggleAttendanceFn>>
export type ToggleAttendanceFnData = Extract<ToggleAttendanceFnShape, { ok: true }>['data']
