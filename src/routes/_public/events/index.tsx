import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getPublicEventsFn } from '@/server/core/handlers/public/get-public-events.handler'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'

export const Route = createFileRoute('/_public/events/')({
  component: PublicEventsPage,
})

function PublicEventsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['public-events'],
    queryFn: () => getPublicEventsFn(),
  })

  if (isLoading) {
    return <div className="p-12 text-center text-muted-foreground">Loading events...</div>
  }

  if (error || !data) {
    return (
      <div className="p-12 text-center text-destructive">
        Failed to load public events.
      </div>
    )
  }

  const { upcoming, past } = data

  const renderEventCard = (event: typeof upcoming[0]) => (
    <Card 
      key={event.id} 
      className="group relative overflow-hidden rounded-none border-0 bg-slate-900/40 transition-all duration-500 hover:shadow-[0_0_40px_rgba(246,200,78,0.15)] backdrop-blur-sm h-full"
    >
      <Link to="/events/$eventId" params={{ eventId: event.id }} className="block h-full relative z-10 flex flex-col justify-between p-2">
        <div>
          <CardHeader className="relative z-10">
            <CardTitle className="text-2xl font-black uppercase text-white group-hover:-translate-y-1 transition-transform group-hover:text-wmu-gold duration-300">
              {event.title}
            </CardTitle>
            <CardDescription className="flex flex-col gap-1 mt-2 transition-all opacity-90 group-hover:opacity-100 group-hover:-translate-y-1 duration-300">
              <span className="font-medium text-wmu-gold">
              {format(new Date(event.startTime), 'EEEE, MMMM do yyyy, h:mm a')}
            </span>
            {event.location && (
              <span className="text-slate-500">{event.location}</span>
            )}
          </CardDescription>
        </CardHeader>
        {event.description && (
          <CardContent className="relative z-10 pt-0">
            <p className="text-sm md:text-base font-medium text-slate-400 line-clamp-3 transition-all opacity-90 group-hover:opacity-100 group-hover:-translate-y-1 duration-300">
              {event.description}
            </p>
          </CardContent>
        )}
        </div>
      </Link>

      {/* League style border accents */}
      <div className="absolute top-0 left-0 w-8 h-[3px] bg-wmu-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="absolute top-0 left-0 w-[3px] h-8 bg-wmu-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="absolute bottom-0 right-0 w-8 h-[3px] bg-wmu-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[3px] h-8 bg-wmu-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Bottom glowing border */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-wmu-gold to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
    </Card>
  )

  return (
    <div className="min-h-screen bg-slate-950 font-sans selection:bg-wmu-gold/30 pt-32 md:pt-48 pb-24 relative overflow-hidden">
      {/* Abstract atmospheric glow */}
      <div className="absolute top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-cyan-900/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-900/10 blur-[100px] pointer-events-none"></div>

      <div className="container relative mx-auto px-6 max-w-5xl z-10">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter mb-6">
            Club <span className="text-transparent bg-clip-text bg-gradient-to-r from-wmu-brown via-wmu-gold to-white">Events</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium">
          Join us for hands-on technical workshops, guest speaker presentations, and hackathons designed to accelerate your software engineering career.
        </p>
      </div>

      <div className="mb-20">
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-8 flex items-center gap-3">
          Upcoming Events
          <span className="bg-wmu-gold/10 text-wmu-gold text-sm px-3 py-1 rounded-full border border-wmu-gold/20 font-bold tracking-widest">{upcoming.length}</span>
        </h2>
        
        {upcoming.length === 0 ? (
          <div className="text-center p-12 border border-slate-800 bg-slate-900/30 rounded-xl text-slate-500 backdrop-blur-sm">
            There are currently no upcoming scheduled events. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcoming.map(renderEventCard)}
          </div>
        )}
      </div>

      {past.length > 0 && (
        <div className="opacity-80">
          <h2 className="text-2xl font-black text-slate-400 uppercase tracking-tighter mb-8 flex items-center gap-3">
            Past Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {past.map(renderEventCard)}
          </div>
        </div>
      )}
    </div>
  </div>
  )
}
