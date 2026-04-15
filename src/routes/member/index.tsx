import { assertMemberFn } from '@/server/helpers/route-protection'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import {
  getMemberProfileFn,
  type GetMemberProfileFnData,
} from '@/server/core/handlers/app/get-member-profile.handler'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Clock, Eye } from 'lucide-react'
import { format } from 'date-fns'

export const Route = createFileRoute('/member/')({
  component: RouteComponent,
  beforeLoad: async () => {
    const session = await assertMemberFn()
    return { session }
  },
})

function RouteComponent() {
  const { session } = Route.useRouteContext()
  const userId = session?.user.id

  const { data: memberResponse, isLoading } = useQuery({
    queryKey: ['member-profile', userId],
    queryFn: () => getMemberProfileFn({ data: userId! }),
    enabled: !!userId,
  })

  const member: GetMemberProfileFnData | undefined = memberResponse?.ok
    ? memberResponse.data
    : undefined

  const attendedEvents = member?.eventAttendees || []

  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
        <p className="text-muted-foreground">
          {member ? `Welcome back, ${member.name}` : 'Your event history and stats.'}
        </p>
      </div>

      {member && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Level</CardDescription>
              <CardTitle className="text-2xl">{member.level}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>XP</CardDescription>
              <CardTitle className="text-2xl">{member.xp}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Streak</CardDescription>
              <CardTitle className="text-2xl">{member.streak} days</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Events Attended</CardDescription>
              <CardTitle className="text-2xl">{attendedEvents.length}</CardTitle>
            </CardHeader>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Event History</CardTitle>
          <CardDescription>Events you have attended.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="w-[80px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : attendedEvents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No events attended yet. Once an officer marks you present, they will appear here.
                  </TableCell>
                </TableRow>
              ) : (
                attendedEvents.map((attendance: any) => (
                  <TableRow key={attendance.id}>
                    <TableCell className="font-medium">
                      {attendance.event.title}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {attendance.event.eventTagOnEvents?.map((te: any) => (
                          <Badge key={te.tagId} variant="secondary" className="text-xs">
                            {te.tag.name}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" />
                        {format(new Date(attendance.event.startTime), 'MMM d, yyyy')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        {format(new Date(attendance.event.startTime), 'h:mm a')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5" />
                        {attendance.event.location || 'Online'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link
                        to="/app/events/$eventId"
                        params={{ eventId: attendance.event.id }}
                      >
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          <span className="sr-only">View</span>
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
