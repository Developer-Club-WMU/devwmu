import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getEventFn } from '@/server/core/handlers/app/get-event.handler'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { 
  Users, 
  MapPin, 
  Clock, 
  Calendar, 
  Edit2, 
  ChevronLeft,
  CheckCircle2,
  XCircle
} from 'lucide-react'
import { assertOfficerFn } from '@/server/helpers/route-protection'

export const Route = createFileRoute('/app/events/$eventId/')({
  component: EventDetailsPage,
  beforeLoad: () => assertOfficerFn(),
})

function EventDetailsPage() {
  const { eventId } = Route.useParams()

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['events', eventId],
    queryFn: () => getEventFn({ data: eventId }),
  })

  if (isLoading) {
    return <div className="p-8 animate-pulse text-muted-foreground">Loading event details...</div>
  }

  if (error || !event) {
    return (
      <div className="p-8 text-center text-destructive bg-destructive/10 rounded-xl m-6">
        <XCircle className="w-12 h-12 mx-auto mb-4" />
        <h2 className="text-xl font-bold uppercase">Event Not Found</h2>
        <p className="mt-2 text-sm opacity-80 font-medium">This event may have been deleted or is inaccessible.</p>
        <Link to="/app/events">
          <Button variant="outline" className="mt-6">Back to Events</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container py-8 max-w-7xl mx-auto space-y-8">
      {/* Header / Breadcrumbs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Link 
            to="/app/events" 
            className="flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-2 uppercase"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Events
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-black tracking-tight uppercase">{event.title}</h1>
            <Badge className="font-bold">{event.status}</Badge>
          </div>
        </div>
        <Link to="/app/events/$eventId/edit" params={{ eventId }}>
          <Button className="font-bold uppercase tracking-widest px-8 shadow-lg shadow-primary/20">
            <Edit2 className="w-4 h-4 mr-2" /> Edit Event
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-0 shadow-xl overflow-hidden bg-card/50 backdrop-blur-md">
            <div className="h-1 bg-primary w-full" />
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-black uppercase flex items-center gap-2 tracking-tight">
                <Calendar className="w-5 h-5 text-primary" /> Event Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase text-muted-foreground tracking-widest mb-1">Time & Date</div>
                      <div className="font-bold text-lg">
                        {format(new Date(event.startTime), 'MMMM do, yyyy')}
                      </div>
                      <div className="text-sm text-muted-foreground font-medium">
                        {format(new Date(event.startTime), 'h:mm a')} - {format(new Date(event.endTime), 'h:mm a')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase text-muted-foreground tracking-widest mb-1">Location</div>
                      <div className="font-bold text-lg">{event.location || 'TBA'}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase text-muted-foreground tracking-widest mb-1">Attendance</div>
                      <div className="font-bold text-lg">{event._count?.attendees || 0} Registered</div>
                      {event.capacity && (
                        <div className="text-sm text-muted-foreground font-medium">
                          Capacity: {event.capacity} seats
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {event.description && (
                <div className="border-t pt-8">
                  <div className="text-xs font-bold uppercase text-muted-foreground tracking-widest mb-4">Description</div>
                  <div className="prose prose-slate max-w-none text-muted-foreground font-medium leading-relaxed">
                    {event.description}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Attendees List */}
          <section className="space-y-4">
            <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" /> Registered Members
            </h2>
            <Card className="border-0 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted uppercase">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="font-bold text-xs py-4">Member</TableHead>
                      <TableHead className="font-bold text-xs py-4">Email</TableHead>
                      <TableHead className="font-bold text-xs py-4">RSVP Date</TableHead>
                      <TableHead className="font-bold text-xs py-4 text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {event.attendees?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center h-32 text-muted-foreground font-medium">
                          No members have registered for this event yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      event.attendees?.map((attendee: any) => (
                        <TableRow key={attendee.id} className="hover:bg-muted/30 transition-colors">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {attendee.user.image ? (
                                <img src={attendee.user.image} alt={attendee.user.name} className="w-8 h-8 rounded-full border border-primary/20" />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs border border-primary/20">
                                  {attendee.user.name.charAt(0)}
                                </div>
                              )}
                              <span className="font-bold text-slate-700">{attendee.user.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground font-medium lowercase">
                            {attendee.user.email}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground font-medium">
                            {format(new Date(attendee.rsvpAt), 'MMM do, yyyy')}
                          </TableCell>
                          <TableCell className="text-right">
                            {attendee.attended ? (
                              <Badge variant="default" className="bg-green-500 hover:bg-green-600 font-bold uppercase text-[10px]">
                                <CheckCircle2 className="w-3 h-3 mr-1" /> Attended
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="font-bold uppercase text-[10px]">
                                Registered
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </section>
        </div>

        {/* Right Column: Mini Stats / Meta */}
        <div className="space-y-8">
          <Card className="bg-primary text-primary-foreground border-0 shadow-lg shadow-primary/20">
            <CardHeader>
              <CardTitle className="text-lg font-black uppercase">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center border-b border-white/20 pb-4">
                <span className="text-sm font-bold opacity-80 uppercase tracking-widest">Growth</span>
                <span className="text-2xl font-black">+{event._count?.attendees || 0}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/20 pb-4">
                <span className="text-sm font-bold opacity-80 uppercase tracking-widest">Share Range</span>
                <span className="text-lg font-black">100%</span>
              </div>
              <div className="pt-2">
                <div className="text-xs font-bold uppercase opacity-80 mb-2">Registration Velocity</div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-3/4 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl overflow-hidden">
            <CardHeader className="bg-muted/50 border-b">
              <CardTitle className="text-lg font-black uppercase">Technical Metadata</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground font-bold uppercase text-xs tracking-widest">Visibility</span>
                <span className="font-bold">{event.isPublic ? 'Public' : 'Private'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground font-bold uppercase text-xs tracking-widest">Created ID</span>
                <code className="bg-muted px-2 py-0.5 rounded text-[10px] font-mono">{event.createdById}</code>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground font-bold uppercase text-xs tracking-widest">Record ID</span>
                <code className="bg-muted px-2 py-0.5 rounded text-[10px] font-mono">{event.id}</code>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
