import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

interface DateTimePickerProps {
  value: Date
  onChange: (date: Date) => void
}

export function DateTimePicker({ value, onChange }: DateTimePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(value)
  
  // Update internal state when value prop changes
  React.useEffect(() => {
    setDate(value)
  }, [value])

  const handleSelect = (newDate: Date | undefined) => {
    if (newDate) {
      if (!date) {
        setDate(newDate)
        onChange(newDate)
        return
      }

      // Preserve the time from the previous date value
      newDate.setHours(date.getHours())
      newDate.setMinutes(date.getMinutes())
      setDate(newDate)
      onChange(newDate)
    }
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeValue = e.target.value
    if (!timeValue || !date) return

    const [hours, minutes] = timeValue.split(":").map(Number)
    const newDate = new Date(date)
    newDate.setHours(hours)
    newDate.setMinutes(minutes)
    
    setDate(newDate)
    onChange(newDate)
  }

  const timeValue = date ? format(date, "HH:mm") : ""

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP p") : <span>Pick a date and time</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
        />
        <div className="p-3 border-t flex items-center justify-between gap-2">
          <span className="text-sm font-medium">Time</span>
          <Input 
            type="time" 
            value={timeValue} 
            onChange={handleTimeChange} 
            className="w-auto h-8"
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
