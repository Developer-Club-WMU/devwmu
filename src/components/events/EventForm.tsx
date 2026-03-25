import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
// Removed unused Card import
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DateTimePicker } from '@/components/ui/datetime-picker'
import MDEditor from '@uiw/react-md-editor'
import remarkGfm from 'remark-gfm'
import { upsertEventSchema } from '@/server/core/handlers/app/upsert-event.handler'
import { z } from 'zod'
import { EventStatus } from 'generated/enums'

type EventFormValues = z.infer<typeof upsertEventSchema>

interface EventFormProps {
  defaultValues?: Partial<EventFormValues>
  onSubmit: (values: EventFormValues) => Promise<void>
  userId: string
}

export function EventForm({ defaultValues, onSubmit, userId }: EventFormProps) {
  const form = useForm({
    defaultValues: {
      title: defaultValues?.title ?? '',
      description: defaultValues?.description ?? '',
      content: defaultValues?.content ?? '',
      location: defaultValues?.location ?? '',
      startTime: defaultValues?.startTime ?? new Date(),
      endTime: defaultValues?.endTime ?? new Date(Date.now() + 3600000), // Default to 1 hour from now
      capacity: defaultValues?.capacity ?? null,
      status: defaultValues?.status ?? EventStatus.DRAFT,
      isPublic: defaultValues?.isPublic ?? false,
      createdById: userId,
    } as EventFormValues,
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
    // @ts-expect-error - Expected due to mismatch in React Form and Zod versions
    validatorAdapter: zodValidator(),
    validators: {
      onChange: upsertEventSchema as any,
    },
  })

  // We use the custom DateTimePicker instead


  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Metadata */}
        <div className="lg:col-span-5 space-y-6">
          <form.Field
            name="title"
            children={(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Event Title *</Label>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="WMU Hackathon 2026"
                  className="font-bold text-lg"
                />
                {field.state.meta.errors ? (
                  <em className="text-sm text-destructive" role="alert">
                    {field.state.meta.errors.join(', ')}
                  </em>
                ) : null}
              </div>
            )}
          />

          <div className="grid grid-cols-1 gap-4">
            <form.Field
              name="startTime"
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Start Time *</Label>
                  <DateTimePicker
                    value={field.state.value}
                    onChange={(newDate) => {
                      field.handleChange(newDate)
                      const currentEnd = form.getFieldValue('endTime')
                      if (newDate >= currentEnd) {
                        form.setFieldValue(
                          'endTime',
                          new Date(newDate.getTime() + 3600000),
                        )
                      }
                    }}
                  />
                </div>
              )}
            />

            <form.Field
              name="endTime"
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>End Time *</Label>
                  <DateTimePicker
                    value={field.state.value}
                    onChange={(newDate) => field.handleChange(newDate)}
                  />
                </div>
              )}
            />
          </div>

          <form.Field
            name="location"
            children={(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Location</Label>
                <Input
                  id={field.name}
                  value={field.state.value ?? ''}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Parkview Campus Room D-115"
                />
              </div>
            )}
          />

          <form.Field
            name="description"
            children={(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Short Description</Label>
                <Textarea
                  id={field.name}
                  value={field.state.value ?? ''}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="A brief summary for cards..."
                  className="resize-none"
                  rows={2}
                />
              </div>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <form.Field
              name="status"
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Status</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) =>
                      field.handleChange(value as EventStatus)
                    }
                  >
                    <SelectTrigger id={field.name}>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={EventStatus.DRAFT}>Draft</SelectItem>
                      <SelectItem value={EventStatus.REVIEW}>Review</SelectItem>
                      <SelectItem value={EventStatus.APPROVED}>Approved</SelectItem>
                      <SelectItem value={EventStatus.PUBLISHED}>Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            />

            <form.Field
              name="capacity"
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Capacity</Label>
                  <Input
                    id={field.name}
                    type="number"
                    value={field.state.value ?? ''}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(
                        e.target.value ? parseInt(e.target.value, 10) : null,
                      )
                    }
                    placeholder="Limit"
                  />
                </div>
              )}
            />
          </div>

          <form.Field
            name="isPublic"
            children={(field) => (
              <div className="flex flex-row items-start space-x-3 space-y-0 p-4 border border-slate-800 bg-slate-900/50 rounded-lg">
                <Checkbox
                  id={field.name}
                  checked={field.state.value}
                  onCheckedChange={(checked) =>
                    field.handleChange(checked as boolean)
                  }
                />
                <div className="space-y-1 leading-none">
                  <Label htmlFor={field.name}>Public Event</Label>
                  <p className="text-xs text-slate-500">
                    Visible on the public landing page.
                  </p>
                </div>
              </div>
            )}
          />
        </div>

        {/* Right Column: Markdown Editor */}
        <div className="lg:col-span-7 space-y-4 flex flex-col h-full">
          <form.Field
            name="content"
            children={(field) => (
              <div className="space-y-2 flex-grow flex flex-col h-full min-h-[500px]">
                <Label htmlFor={field.name} className="flex justify-between items-center">
                  <span>Markdown Content</span>
                  <span className="text-xs text-slate-500 font-normal">Supports GitHub Flavored Markdown</span>
                </Label>
                <div className="flex-grow border border-slate-800 bg-slate-950 rounded-lg overflow-hidden flex flex-col h-full shadow-inner">
                  <div data-color-mode="dark" className="flex-grow flex flex-col h-full">
                    <MDEditor
                      value={field.state.value ?? ''}
                      onChange={(val) => field.handleChange(val ?? '')}
                      height="100%"
                      minHeight={500}
                      preview="edit"
                      className="w-full border-0 !bg-transparent rounded-none flex-grow h-full"
                      style={{ backgroundColor: 'transparent' }}
                      previewOptions={{
                        remarkPlugins: [remarkGfm],
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          />
        </div>
      </div>

      <div className="pt-6 border-t border-slate-800 flex justify-between items-center">
        <form.Subscribe
          selector={(state) => [state.errorMap]}
          children={([errorMap]) => {
            if (!errorMap || !errorMap.onChange) return <div />
            return (
              <div className="text-sm font-medium text-destructive px-4 py-2 bg-destructive/10 rounded-full">
                {errorMap.onChange.toString()}
              </div>
            )
          }}
        />

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                size="lg"
                className="px-8 bg-wmu-gold text-slate-950 hover:bg-white font-black uppercase tracking-widest transition-all"
              >
                {isSubmitting ? 'Saving...' : 'Save Event'}
              </Button>
            </div>
          )}
        />
      </div>
    </form>
  )
}
