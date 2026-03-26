import { Context, Effect, Layer } from 'effect'
import { DbClient, DbClientLive } from '../repositories/prisma.repository'
import { PrismaError } from '../shared/errors'
import { differenceInHours, isSameDay, subDays } from 'date-fns'

export class ProgressionService extends Context.Tag('ProgressionService')<
  ProgressionService,
  ProgressionServiceMethods
>() {}

interface ProgressionServiceMethods {
  readonly awardAttendanceXP: (args: {
    eventId: string
    userId: string
  }) => Effect.Effect<any, PrismaError>

  readonly calculateEarnedXP: (args: {
    event: any
    user: any
    attendee: any
  }) => number
}

export const ProgressionServiceLive = Layer.effect(
  ProgressionService,
  Effect.gen(function* () {
    const dbClient = yield* DbClient

    const calculateEarnedXP = ({ event, user, attendee }: any) => {
      if (!attendee.attended) return 0

      let baseXP = 50

      // Multiplier A: Duration
      const durationHours = Math.max(0, differenceInHours(new Date(event.endTime), new Date(event.startTime)))
      const durationBonus = Math.min(durationHours * 0.1, 1.0)

      // Multiplier B: Tags (Rarity)
      const tags = event.eventTagOnEvents?.map((te: any) => te.tag.name.toLowerCase()) || []
      let tagBonus = 0
      if (tags.includes('featured')) tagBonus += 0.5
      if (tags.includes('workshop')) tagBonus += 0.3
      if (tags.includes('bootcamp')) tagBonus += 0.5

      // Multiplier C: First-Time
      const isFirstTime = !user.lastEventDate
      const firstTimeBonus = isFirstTime ? 0.25 : 0

      const multiplier = 1 + durationBonus + tagBonus + firstTimeBonus
      let xp = baseXP * multiplier

      // Bonuses (Additive)
      
      // Streak Bonus
      const streakBonus = Math.min(user.streak * 5, 50)
      xp += streakBonus

      // RSVP Commitment Bonus
      const rsvpAheadHours = differenceInHours(new Date(event.startTime), new Date(attendee.rsvpAt))
      if (rsvpAheadHours >= 24) xp += 10

      // Capacity pressure
      if (event.capacity) {
        if (event.capacity <= 10) xp += 25
        else if (event.capacity <= 25) xp += 15
      }

      return Math.round(xp)
    }

    const calculateNewLevel = (currentXP: number) => {
      let level = 1
      while (true) {
        const xpForNext = 100 * Math.pow(level, 1.5)
        if (currentXP >= xpForNext) {
          currentXP -= xpForNext
          level++
        } else {
          break
        }
      }
      return level
    }

    const getTitleForLevel = (level: number) => {
      if (level >= 21) return 'WIZARD'
      if (level >= 13) return 'ARCHITECT'
      if (level >= 8) return 'NINJA'
      if (level >= 4) return 'APPRENTICE'
      return 'ROOKIE'
    }

    return {
      calculateEarnedXP,
      awardAttendanceXP: ({ eventId, userId }) =>
        Effect.tryPromise({
          try: async () => {
            const [event, user] = await Promise.all([
              dbClient.event.findUnique({
                where: { id: eventId },
                include: { eventTagOnEvents: { include: { tag: true } } }
              }),
              dbClient.user.findUnique({ where: { id: userId } }),
            ])

            if (!event || !user) throw new Error('Event or User not found')

            const attendee = await dbClient.eventAttendee.findUnique({
              where: { eventId_userId: { eventId, userId } }
            })

            if (!attendee || !attendee.attended) return null

            const xpEarned = calculateEarnedXP({ event, user, attendee })
            
            // Calculate new streak
            const now = new Date()
            let newStreak = user.streak
            if (!user.lastEventDate) {
              newStreak = 1
            } else {
              const yesterday = subDays(now, 1)
              const wasYesterday = isSameDay(new Date(user.lastEventDate), yesterday)
              if (wasYesterday) {
                newStreak += 1
              } else if (!isSameDay(new Date(user.lastEventDate), now)) {
                // If it's not today and not yesterday, streak resets
                newStreak = 1
              }
            }

            const totalXP = user.xp + xpEarned
            const newLevel = calculateNewLevel(totalXP)
            const newTitle = getTitleForLevel(newLevel)

            return dbClient.user.update({
              where: { id: userId },
              data: {
                xp: totalXP,
                level: newLevel,
                title: newTitle as any,
                streak: newStreak,
                lastEventDate: now
              }
            })
          },
          catch: (e: any) => new PrismaError({ message: 'Failed to award XP: ' + e.message })
        })
    }
  })
)

export const ProgressionServiceLayer = ProgressionServiceLive.pipe(
  Layer.provide(DbClientLive)
)
