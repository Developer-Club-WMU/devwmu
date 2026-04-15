import { assertAuthenticatedFn } from '@/server/helpers/route-protection'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  listEventsFn, 
  type ListEventsFnData 
} from '@/server/core/handlers/app/list-events.handler'
import { rsvpEventFn } from '@/server/core/handlers/app/rsvp-event.handler'
import { authClient } from '@/lib/auth-client'
import {
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Trophy,
  Users,
  Zap,
  LayoutDashboard,
  UserPlus,
  Check,
} from 'lucide-react'
import { format } from 'date-fns'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export const Route = createFileRoute('/app/')({
  component: Dashboard,
  beforeLoad: () => assertAuthenticatedFn(),
})

const TITLE_MAP: Record<string, string> = {
  ROOKIE: 'Rookie Developer',
  APPRENTICE: 'Code Apprentice',
  NINJA: 'Syntax Ninja',
  ARCHITECT: 'Logic Architect',
  WIZARD: 'Fullstack Wizard',
}

function Dashboard() {
  const { data: session } = authClient.useSession()
  const queryClient = useQueryClient()
  const user = session?.user as any

  const { data: response, isLoading } = useQuery({
    queryKey: ['events', user?.id],
    queryFn: () => listEventsFn({ data: { userId: user?.id } }),
    enabled: !!user?.id,
  })

  const { mutate: toggleRSVP } = useMutation({
    mutationFn: (args: { eventId: string; status: boolean }) =>
      rsvpEventFn({ data: { ...args, userId: user?.id } }),
    onSuccess: (res: any, variables) => {
      if (res.ok) {
        queryClient.invalidateQueries({ queryKey: ['events'] })
        toast.success(variables.status ? 'See you there!' : 'RSVP removed')
      } else {
        toast.error('Failed to update RSVP: ' + res.error)
      }
    },
    onError: (err: any) => {
      toast.error('Failed to update RSVP: ' + err.message)
    },
  })

  // Handle Event Categorization
  const events: ListEventsFnData = response?.ok ? response.data : []
  const now = new Date()
  const ongoing =
    events?.filter((e: any) => {
      const start = new Date(e.startTime)
      const end = new Date(e.endTime)
      return now >= start && now <= end
    }) || []

  const upcoming =
    events
      ?.filter((e: any) => {
        const start = new Date(e.startTime)
        return start > now
      })
      .sort(
        (a: any, b: any) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
      )
      .slice(0, 5) || []

  const attended =
    events
      ?.filter((e: any) => e.attendees?.some((a: any) => a.attended))
      .sort(
        (a: any, b: any) =>
          new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
      ) || []

  if (isLoading) {
    return (
      <div className="p-8 animate-pulse text-muted-foreground">
        Loading your dashboard...
      </div>
    )
  }

  return (
    <div className="container py-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary mb-2">
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-wider">
              Member Dashboard
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tight">
            Welcome back,{' '}
            <span className="text-primary">
              {user?.name?.split(' ')[0] || 'Member'}
            </span>
            !
          </h1>
          <p className="text-muted-foreground font-medium">
            Here's what's happening in the club.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed: Events */}
        <div className="lg:col-span-2 space-y-12">
          {/* Ongoing Events */}
          {ongoing.length > 0 && (
            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-4 flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-500 fill-yellow-500/20" />
                Ongoing Sessions
              </h2>
              <div className="space-y-4">
                {ongoing.map((event: any) => (
                  <Card
                    key={event.id}
                    className="relative overflow-hidden border-yellow-500/30 bg-yellow-500/5 hover:bg-yellow-500/10 transition-colors"
                  >
                    <CardHeader className="p-5 pb-2">
                      <div className="flex justify-between items-start">
                        <Badge
                          variant="destructive"
                          className="animate-pulse mb-2"
                        >
                          LIVE NOW
                        </Badge>
                        <Link
                          to="/app/events/$eventId"
                          params={{ eventId: event.id }}
                          className="text-xs font-bold uppercase text-yellow-600 hover:text-yellow-700 flex items-center"
                        >
                          View Details <ChevronRight className="w-3 h-3" />
                        </Link>
                      </div>
                      <CardTitle className="text-xl font-black">
                        {event.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 pt-0">
                      <div className="flex flex-wrap gap-4 text-sm font-medium text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />{' '}
                          {event.location || 'Online'}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" /> Until{' '}
                          {format(new Date(event.endTime), 'h:mm a')}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Attended Events (History) */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
                <Check className="w-6 h-6 text-emerald-500" />
                Attendance History
              </h2>
            </div>

            <div className="space-y-4">
              {attended.map((event: any) => (
                <Card
                  key={event.id}
                  className="hover:border-primary/50 transition-all duration-300 group overflow-hidden"
                >
                  <CardContent className="p-0">
                    <div className="flex items-center p-5 gap-6">
                        <div className="hidden md:flex flex-col items-center justify-center p-3 bg-muted/30 rounded-xl min-w-[80px]">
                            <span className="text-[10px] font-black uppercase text-muted-foreground">{format(new Date(event.startTime), 'MMM')}</span>
                            <span className="text-xl font-black">{format(new Date(event.startTime), 'dd')}</span>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{event.title}</h3>
                            <div className="flex gap-4 text-xs font-medium text-muted-foreground mt-1">
                                <div className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {event.location || 'TBA'}</div>
                                <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> {format(new Date(event.startTime), 'h:mm a')}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-emerald-500 border-emerald-500/20 bg-emerald-500/5 font-black text-[10px] uppercase">
                                Attended
                            </Badge>
                            <Link to="/app/events/$eventId" params={{ eventId: event.id }}>
                                <Button variant="ghost" size="icon">
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {attended.length === 0 && (
                <div className="p-12 text-center border-2 border-dashed rounded-xl text-muted-foreground font-medium">
                  You haven't attended any events yet.
                </div>
              )}
            </div>
          </section>

          {/* Upcoming Events */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
                <Calendar className="w-6 h-6 text-primary" />
                Upcoming Events
              </h2>
              <Link
                to="/app/events"
                className="text-sm font-bold uppercase text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
              >
                Full Calendar <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcoming.map((event: any) => {
                const isGoing = event.attendees?.length > 0
                return (
                  <Card
                    key={event.id}
                    className="hover:border-primary/50 transition-all duration-300 group relative overflow-hidden"
                  >
                    <CardHeader className="p-5 pb-2">
                      <div className="flex justify-between items-start">
                        <div className="text-xs font-bold text-primary uppercase tracking-widest mb-2">
                          {format(new Date(event.startTime), 'MMMM do')}
                        </div>
                        <Button
                          size="sm"
                          variant={isGoing ? 'secondary' : 'default'}
                          className="h-8 rounded-lg font-bold text-xs uppercase transition-all"
                          onClick={() =>
                            toggleRSVP({ eventId: event.id, status: !isGoing })
                          }
                        >
                          {isGoing ? (
                            <>
                              <Check className="w-3 h-3 mr-1" /> Going
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-3 h-3 mr-1" /> Join
                            </>
                          )}
                        </Button>
                      </div>
                      <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-1">
                        {event.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 pt-0">
                      <div className="flex flex-col gap-2 text-sm text-muted-foreground font-medium">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />{' '}
                          {format(new Date(event.startTime), 'h:mm a')}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />{' '}
                          {event.location || 'TBA'}
                        </div>
                        <div className="flex items-center gap-1.5 text-primary/70">
                          <Users className="w-4 h-4" />{' '}
                          {event._count?.attendees || 0} attending
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}

              {upcoming.length === 0 && (
                <div className="col-span-full p-12 text-center border-2 border-dashed rounded-xl text-muted-foreground font-medium">
                  No upcoming events. Stay tuned!
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar: Quick Links & Stats */}
        <div className="space-y-8">
          {/* Membership Card */}
          <Card className="bg-public-accent text-public-bg overflow-hidden relative border-0 shadow-xl shadow-public-accent/10">
            <div className="absolute top-0 right-0 -translate-y-4 translate-x-4 opacity-20">
              <Trophy className="w-32 h-32" />
            </div>
            <CardHeader>
              <CardTitle className="text-xl font-black uppercase">
                Your Journey
              </CardTitle>
              <CardDescription className="text-public-bg/70 font-bold italic">
                Dev Club {user?.role === 'admin' ? 'Officer' : 'Member'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-public-bg/10 rounded-xl backdrop-blur-md border border-public-bg/10">
                  <Users className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-2xl font-black">
                    Level {user?.level || 1}
                  </div>
                  <div className="text-xs uppercase font-bold tracking-widest opacity-80">
                    {user?.title
                      ? TITLE_MAP[user.title] || user.title
                      : 'Rookie Developer'}
                  </div>
                </div>
              </div>
              <div className="w-full py-3 bg-public-bg text-public-accent rounded-lg font-black uppercase text-sm flex items-center justify-center gap-2 cursor-pointer hover:bg-public-bg/90 transition-colors shadow-lg">
                Complete Profile <ChevronRight className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-black uppercase">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-col divide-y transition-all">
                <Link
                  to="/app/events"
                  className="p-4 flex items-center justify-between hover:bg-muted font-bold text-sm"
                >
                  Register for Hackathon{' '}
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </Link>
                <Link
                  to="/app/events/create"
                  className="p-4 flex items-center justify-between hover:bg-muted font-bold text-sm"
                >
                  Propose an Event{' '}
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </Link>
                <div className="p-4 flex items-center justify-between hover:bg-muted font-bold text-sm cursor-pointer">
                  Project Submission{' '}
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
