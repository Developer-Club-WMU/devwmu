import { Link } from '@tanstack/react-router'
import { Terminal, Settings, User } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { Button } from './ui/button'

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center gap-4 px-4 md:px-6 max-w-7xl mx-auto">
        <Link to="/app" className="flex items-center gap-2 mr-6">
          <Terminal className="h-6 w-6" />
          <span className="font-bold hidden md:inline-block">
            Officer Dashboard
          </span>
        </Link>

        {/* Navigation links could go here if added later */}
        <nav className="flex-1 flex items-center gap-6 text-sm font-medium">
          <Link
            to="/app"
            className="transition-colors hover:text-foreground/80 text-foreground"
          >
            Overview
          </Link>
          <Link
            to="/app"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Members
          </Link>
          <Link
            to="/app"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Events
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="rounded-full">
            <Settings className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Settings</span>
          </Button>
          <Button variant="secondary" size="icon" className="rounded-full ml-2">
            <User className="h-4 w-4" />
            <span className="sr-only">Profile</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
