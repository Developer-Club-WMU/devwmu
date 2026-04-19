import { Link } from '@tanstack/react-router'
import { Terminal, Settings, User, House } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { navigationConfig } from '@/config/navigation'
import { Button } from './ui/button'
import { authClient } from '@/lib/auth-client'

export function AppHeader() {
  const { data: session } = authClient.useSession()
  const isAdmin = session?.user?.role === 'admin'
  const mainNav = isAdmin
    ? navigationConfig.app.mainNav
    : navigationConfig.member.mainNav

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center gap-4 px-4 md:px-6 max-w-7xl mx-auto">
        <Link
          to={isAdmin ? '/app' : '/member'}
          className="flex items-center gap-2 mr-6"
        >
          <Terminal className="h-6 w-6" />
          <span className="font-bold hidden md:inline-block">
            {isAdmin ? 'Officer' : 'Member'} Dashboard
          </span>
        </Link>

        <nav className="flex-1 flex items-center gap-6 text-sm font-medium">
          {mainNav.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              className="transition-colors hover:text-foreground/80 text-foreground/60 [&.active]:text-foreground"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="hidden sm:inline-flex"
          >
            <Link to="/">
              <House className="h-4 w-4" />
              Landing
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="rounded-full sm:hidden"
          >
            <Link to="/" aria-label="Back to landing page">
              <House className="h-[1.2rem] w-[1.2rem]" />
            </Link>
          </Button>
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
