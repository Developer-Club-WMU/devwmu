import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getMemberProfileFn,
  type GetMemberProfileFnData
} from '@/server/core/handlers/app/get-member-profile.handler'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Trophy,
  Calendar,
  MapPin,
  Clock,
  ChevronLeft,
  Mail,
  Zap,
  Target,
  Award,
  History,
  AlertCircle,
  ShieldCheck,
  ShieldX,
} from 'lucide-react'
import { format } from 'date-fns'
import { assertOfficerFn } from '@/server/helpers/route-protection'
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'
import { useState } from 'react'

export const Route = createFileRoute('/app/members/$userId')({
  component: MemberProfilePage,
  beforeLoad: () => assertOfficerFn(),
})

const TITLE_MAP: Record<string, string> = {
  ROOKIE: 'Rookie Developer',
  APPRENTICE: 'Code Apprentice',
  NINJA: 'Syntax Ninja',
  ARCHITECT: 'Logic Architect',
  WIZARD: 'Fullstack Wizard',
}

function MemberProfilePage() {
  const { userId } = Route.useParams()
  const queryClient = useQueryClient()
  const [roleLoading, setRoleLoading] = useState(false)

  const { data: memberResponse, isLoading } = useQuery({
    queryKey: ['members', userId],
    queryFn: () => getMemberProfileFn({ data: userId }),
  })

  async function handleSetRole(newRole: 'admin' | 'user') {
    setRoleLoading(true)
    const { error } = await authClient.admin.setRole({ userId, role: newRole })
    setRoleLoading(false)
    if (error) {
      toast.error(`Failed to update role: ${error.message}`)
    } else {
      const name = memberResponse?.ok ? memberResponse.data.name : 'Member'
      toast.success(
        newRole === 'admin'
          ? `${name} is now an officer.`
          : `${name} has been demoted to member.`,
      )
      queryClient.invalidateQueries({ queryKey: ['members', userId] })
    }
  }

  if (isLoading) {
    return (
      <div className="container py-12 animate-pulse space-y-8">
        <div className="h-8 w-48 bg-muted rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 h-96 bg-muted rounded-2xl" />
          <div className="lg:col-span-2 h-96 bg-muted rounded-2xl" />
        </div>
      </div>
    )
  }

  if (!memberResponse || !memberResponse.ok) {
    return (
      <div className="container py-24 text-center">
        <div className="p-4 bg-destructive/10 text-destructive rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black uppercase tracking-tight">Member not found</h1>
        <p className="text-muted-foreground font-medium mt-2">{memberResponse?.error || 'Double check the ID or your connection.'}</p>
        <Link to="/app/members">
          <Button variant="outline" className="mt-8 font-bold uppercase tracking-widest px-8">
            Back to Directory
          </Button>
        </Link>
      </div>
    )
  }

  const member: GetMemberProfileFnData = memberResponse.data

  const attendedEvents = member.eventAttendees || []

  return (
    <div className="container py-8 max-w-7xl mx-auto space-y-8">
      {/* Breadcrumbs / Back */}
      <div>
        <Link
          to="/app/members"
          className="flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Directory
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Card */}
        <div className="space-y-6">
          <Card className="overflow-hidden border-0 shadow-2xl bg-background/50 backdrop-blur-xl rounded-3xl group">
            <div className="h-32 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(var(--primary),0.1),transparent)]" />
            </div>
            <CardContent className="relative px-6 pb-8">
              <div className="flex flex-col items-center -translate-y-12">
                <div className="relative">
                    <div className="w-24 h-24 rounded-3xl bg-background flex items-center justify-center border-4 border-background shadow-xl mb-4 group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                        {member.image ? (
                            <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-primary/10 flex items-center justify-center text-3xl font-black text-primary">
                                {member.name.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-background p-1 rounded-xl shadow-lg">
                        <div className="bg-emerald-500 w-4 h-4 rounded-lg border-2 border-background" />
                    </div>
                </div>
                <h1 className="text-2xl font-black tracking-tight text-center">{member.name}</h1>
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5 mt-1">
                  <Mail className="w-3.5 h-3.5" /> {member.email}
                </p>
                
                <Badge variant="secondary" className="mt-4 uppercase text-[10px] font-black tracking-[0.2em] px-3 py-1 bg-primary/5 text-primary border-primary/10">
                  {member.role || 'MEMBER'}
                </Badge>

                <div className="mt-4 w-full">
                  {member.role === 'admin' ? (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full gap-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          disabled={roleLoading}
                        >
                          <ShieldX className="w-4 h-4" />
                          Revoke Officer Role
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Revoke officer role?</AlertDialogTitle>
                          <AlertDialogDescription>
                            {member.name} will lose all officer privileges and be
                            demoted to a regular member. This can be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive hover:bg-destructive/90"
                            onClick={() => handleSetRole('user')}
                          >
                            Revoke
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full gap-2"
                          disabled={roleLoading}
                        >
                          <ShieldCheck className="w-4 h-4" />
                          Make Officer
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Promote to officer?</AlertDialogTitle>
                          <AlertDialogDescription>
                            {member.name} will gain full officer privileges,
                            including managing events and members. This can be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleSetRole('admin')}>
                            Promote
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="p-4 bg-muted/30 rounded-2xl border border-muted/50 text-center">
                    <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Current Level</div>
                    <div className="text-2xl font-black text-primary">{member.level}</div>
                </div>
                <div className="p-4 bg-muted/30 rounded-2xl border border-muted/50 text-center">
                    <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">XP Points</div>
                    <div className="text-2xl font-black text-primary">{member.xp}</div>
                </div>
              </div>
              
              <div className="mt-6 space-y-4">
                 <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">
                    <span>Rank: {TITLE_MAP[member.title] || member.title}</span>
                    <span>{Math.round((member.xp / (100 * Math.pow(member.level, 1.5))) * 100)}%</span>
                 </div>
                 <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-primary rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(var(--primary),0.3)]" 
                        style={{ width: `${Math.min(100, (member.xp / (100 * Math.pow(member.level, 1.5))) * 100)}%` }}
                    />
                 </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-muted/20 backdrop-blur-md rounded-3xl">
            <CardHeader>
                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                    <Award className="w-4 h-4 text-primary" /> Stats Summary
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                        <Target className="w-4 h-4" /> Streak
                    </div>
                    <div className="font-black">{member.streak} Days</div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                        <Zap className="w-4 h-4" /> Lifetime XP
                    </div>
                    <div className="font-black">{member.xp}</div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                        <Calendar className="w-4 h-4" /> Events
                    </div>
                    <div className="font-black">{attendedEvents.length} attended</div>
                </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Attendance History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-tight uppercase flex items-center gap-3">
              <History className="w-7 h-7 text-primary" /> Participation History
            </h2>
            <Badge variant="outline" className="font-bold border-muted-foreground/20">
              {attendedEvents.length} EVENTS
            </Badge>
          </div>

          <div className="space-y-4">
            {attendedEvents.map((attendance: any) => (
              <Card key={attendance.id} className="overflow-hidden border-muted/50 hover:border-primary/50 transition-all duration-300 group bg-background/50">
                <CardContent className="p-0">
                  <div className="flex">
                    <div className="w-2 bg-primary self-stretch opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex-1 p-6">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 mb-1">
                            {attendance.event.eventTagOnEvents?.map((te: any) => (
                              <Badge key={te.tagId} variant="secondary" className="text-[9px] font-black uppercase px-2 py-0 bg-primary/5 text-primary/70 border-none">
                                {te.tag.name}
                              </Badge>
                            ))}
                          </div>
                          <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                            {attendance.event.title}
                          </h3>
                          <div className="flex flex-wrap gap-4 text-xs font-medium text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              {format(new Date(attendance.event.startTime), 'MMM do, yyyy')}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              {format(new Date(attendance.event.startTime), 'h:mm a')}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5" />
                              {attendance.event.location || 'Online'}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                            <div className="text-right hidden md:block">
                                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Points Earned</div>
                                <div className="text-xl font-black text-primary">+50 XP</div>
                            </div>
                            <Link to="/app/events/$eventId" params={{ eventId: attendance.event.id }}>
                                <Button variant="outline" size="sm" className="font-bold uppercase text-[10px] tracking-widest rounded-xl hover:bg-primary hover:text-white transition-all">
                                    View Details
                                </Button>
                            </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {attendedEvents.length === 0 && (
              <div className="p-16 text-center border-2 border-dashed border-muted rounded-3xl space-y-4">
                <div className="p-4 bg-muted/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                    <Trophy className="w-8 h-8 text-muted-foreground/30" />
                </div>
                <div>
                    <h3 className="text-xl font-bold">No attendance record yet</h3>
                    <p className="text-muted-foreground font-medium max-w-xs mx-auto text-sm mt-1">
                        Once you attend club events and get marked present by an officer, they will appear here.
                    </p>
                </div>
                <Link to="/app/events">
                    <Button variant="default" className="font-bold uppercase tracking-widest mt-4">
                        Discover Events
                    </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
