import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { upsertEventFn } from '@/server/core/handlers/app/upsert-event.handler'
import { EventForm } from '@/components/events/EventForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/app/events/create')({
  component: CreateEventPage,
})

function CreateEventPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  // We need the current user's ID to set as createdById
  const { data: session } = authClient.useSession()

  const { mutateAsync: createEvent } = useMutation({
    mutationFn: (values: Parameters<typeof upsertEventFn>[0]['data']) => 
      upsertEventFn({ data: values }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      toast.success('Event created successfully')
      navigate({ to: '/app/events' })
    },
    onError: (error: Error) => {
      toast.error('Failed to create event: ' + error.message)
    },
  })

  // Loading state for session
  if (!session) {
    return <div className="p-8 text-center">Loading user session...</div>
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create Event</CardTitle>
          <CardDescription>
            Fill out the details below to schedule a new event.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EventForm
            userId={session.user.id}
            onSubmit={async (values) => {
              await createEvent(values)
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
