import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPublicEventsFn } from '@/server/core/handlers/public/get-public-events.handler'
import { rsvpEventFn } from '@/server/core/handlers/app/rsvp-event.handler'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'
import { Check, UserPlus, Users, Loader2 } from 'lucide-react'

export const Route = createFileRoute('/_public/events/')({
  component: PublicEventsPage,
})

function PublicEventsPage() {
  const { data: session } = authClient.useSession()
  const userId = session?.user?.id
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data, isLoading, error } = useQuery({
    queryKey: ['public-events', userId],
    queryFn: () => getPublicEventsFn({ data: { userId } }),
  })

  const { mutate: toggleRSVP, isPending: isRsvpPending } = useMutation({
    mutationFn: (args: { eventId: string; status: boolean }) =>
      rsvpEventFn({ data: { ...args, userId: userId! } }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['public-events'] })
      toast.success(variables.status ? 'See you there!' : 'RSVP removed')
    },
    onError: (err: any) => {
      toast.error('Failed to update RSVP: ' + err.message)
    },
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-public-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-public-accent animate-spin" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-public-bg flex flex-col items-center justify-center p-12 text-center">
        <h2 className="text-2xl font-black text-white uppercase mb-4">Error Loading Events</h2>
        <p className="text-slate-400 mb-8">We couldn't reach the server. Please try again later.</p>
        <Button variant="outline" onClick={() => window.location.reload()} className="border-public-accent text-public-accent hover:bg-public-accent/10">
          Retry
        </Button>
      </div>
    )
  }

  const { ongoing, upcoming, past } = data

  const renderEventCard = (event: any, isUpcoming = false) => {
    const isGoing = event.attendees?.length > 0

    return (
      <Card 
        key={event.id} 
        className="group relative overflow-hidden rounded-none border-0 bg-public-card transition-all duration-500 hover:shadow-[0_0_40px_rgba(246,200,78,0.15)] backdrop-blur-sm h-full flex flex-col"
      >
        <Link to="/events/$eventId" params={{ eventId: event.id }} className="block relative z-10 p-2 flex-grow">
          <CardHeader className="relative z-10">
            <CardTitle className="text-2xl font-black uppercase text-white group-hover:text-public-accent transition-colors duration-300">
              {event.title}
            </CardTitle>
            <CardDescription className="flex flex-col gap-1 mt-2 opacity-90">
              <span className="font-bold text-public-accent tracking-wide uppercase text-xs">
                {format(new Date(event.startTime), 'EEEE, MMM do, h:mm a')}
              </span>
              {event.location && (
                <span className="text-slate-500 font-medium">{event.location}</span>
              )}
            </CardDescription>
          </CardHeader>
          {event.description && (
            <CardContent className="relative z-10 pt-0">
              <p className="text-sm font-medium text-slate-400 line-clamp-3">
                {event.description}
              </p>
            </CardContent>
          )}
        </Link>

        {isUpcoming && (
          <CardFooter className="relative z-10 pt-0 pb-6 px-6 flex justify-between items-center mt-auto">
            <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-widest">
              <Users className="w-4 h-4 text-public-accent/70" />
              {event._count?.attendees || 0} Attending
            </div>
            
            <Button
              size="sm"
              variant={isGoing ? 'outline' : 'default'}
              className={`h-9 px-6 rounded-none font-black uppercase text-[10px] tracking-[0.2em] transition-all border-public-accent ${
                isGoing 
                  ? 'bg-transparent text-public-accent hover:bg-public-accent/10' 
                  : 'bg-public-accent text-public-bg hover:bg-white'
              }`}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (!userId) {
                  navigate({ to: '/sign-in' })
                  return
                }
                toggleRSVP({ eventId: event.id, status: !isGoing })
              }}
              disabled={isRsvpPending}
            >
              {isGoing ? (
                <><Check className="w-3 h-3 mr-1" /> Going</>
              ) : (
                <><UserPlus className="w-3 h-3 mr-1" /> Join</>
              )}
            </Button>
          </CardFooter>
        )}

        {/* League style border accents */}
        <div className="absolute top-0 left-0 w-8 h-[3px] bg-public-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        <div className="absolute top-0 left-0 w-[3px] h-8 bg-public-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-8 h-[3px] bg-public-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[3px] h-8 bg-public-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-public-accent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-public-bg font-sans selection:bg-public-accent/30 pt-32 md:pt-48 pb-24 relative overflow-hidden">
      {/* Abstract atmospheric glow */}
      <div className="absolute top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-public-glow/20 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-public-glow/10 blur-[100px] pointer-events-none"></div>

      <div className="container relative mx-auto px-6 max-w-5xl z-10">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter mb-6">
            Club <span className="text-transparent bg-clip-text bg-gradient-to-r from-public-accent via-white to-white">Events</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium">
            Join us for hands-on technical workshops, guest speaker presentations, and hackathons designed to accelerate your software engineering career.
          </p>
        </div>

        {ongoing.length > 0 && (
          <div className="mb-20">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-8 flex items-center gap-3">
              Ongoing Now
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <span className="text-red-500 text-xs font-black tracking-[0.2em] animate-pulse">
                  LIVE
                </span>
              </div>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {ongoing.map(e => renderEventCard(e))}
            </div>
          </div>
        )}

        <div className="mb-20">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-8 flex items-center gap-3">
            Upcoming Events
            <span className="bg-public-accent/10 text-public-accent text-sm px-3 py-1 rounded-full border border-public-accent/20 font-bold tracking-widest">
              {upcoming.length}
            </span>
          </h2>
          
          {upcoming.length === 0 ? (
            <div className="text-center p-12 border border-public-border bg-public-card/30 rounded-xl text-slate-500 backdrop-blur-sm">
              There are currently no upcoming scheduled events. Check back soon!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcoming.map(e => renderEventCard(e, true))}
            </div>
          )}
        </div>

        {past.length > 0 && (
          <div className="opacity-80">
            <h2 className="text-2xl font-black text-slate-400 uppercase tracking-tighter mb-8 flex items-center gap-3">
              Past Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {past.map(e => renderEventCard(e))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
