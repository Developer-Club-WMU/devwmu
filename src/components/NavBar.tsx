import { Link } from '@tanstack/react-router'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import {
  Terminal,
  LayoutDashboard,
  LogIn,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react'
import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { navigationConfig } from '@/config/navigation'
import type { NavGroup, NavItem } from '@/config/navigation'
import { authClient } from '@/lib/auth-client'

export function NavBar() {
  const { data: session } = authClient.useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const mobilePrimaryCta = { title: 'View Events', href: '/events' }
  const mobileMenuItems = session
    ? [
        ...navigationConfig.public.mainNav,
        { title: 'Dashboard', href: '/dashboard' },
        ...navigationConfig.public.cta.filter(
          (item) => item.title !== 'Sign In' && item.title !== 'View Events',
        ),
      ]
    : [
        ...navigationConfig.public.mainNav,
        { title: 'Sign In', href: '/sign-in' },
        ...navigationConfig.public.cta.filter(
          (item) => item.title !== 'Sign In' && item.title !== 'View Events',
        ),
      ]

  const ctaItems = session
    ? [
        { title: 'Dashboard', href: '/dashboard' },
        ...navigationConfig.public.cta.filter((i) => i.title !== 'Sign In'),
      ]
    : navigationConfig.public.cta

  return (
    <header className="fixed top-0 w-full z-50 bg-public-bg/80 backdrop-blur-md border-b border-public-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3">
        <Link
          to="/"
          className="flex min-w-0 items-center gap-2 group"
          onClick={() => setMobileMenuOpen(false)}
        >
          <Terminal className="w-6 h-6 sm:w-8 sm:h-8 text-public-accent transition-transform group-hover:scale-110 shrink-0" />
          <span className="text-sm sm:text-2xl font-black text-white tracking-tighter uppercase pl-1 whitespace-nowrap leading-none">
            DEV CLUB <span className="text-public-accent">WMU</span>
          </span>
        </Link>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {navigationConfig.public.mainNav.map((item, index) => {
              if ('items' in item) {
                const group = item as NavGroup
                return (
                  <NavigationMenuItem key={index}>
                    <NavigationMenuTrigger className="bg-transparent text-gray-300 hover:text-public-accent hover:bg-public-nav-hover text-sm uppercase tracking-wider font-semibold">
                      {group.title}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-public-card border-public-border">
                        <li className="row-span-3">
                          <NavigationMenuLink asChild>
                            <a
                              className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-public-nav-hover/50 to-public-nav-hover p-6 no-underline outline-none focus:shadow-md border border-public-nav-hover hover:border-public-accent/50 transition-colors group"
                              href="/"
                            >
                              <Terminal className="h-6 w-6 text-public-accent mb-2 transition-transform group-hover:scale-110 group-hover:text-white" />
                              <div className="mb-2 mt-4 text-lg font-bold uppercase tracking-tight text-white group-hover:text-public-accent">
                                Dev Club WMU
                              </div>
                              <p className="text-sm leading-tight text-gray-400">
                                Learn software engineering skills hands-on with
                                real projects.
                              </p>
                            </a>
                          </NavigationMenuLink>
                        </li>
                        {group.items.map((subItem, subIndex) => (
                          <ListItem
                            key={subIndex}
                            href={subItem.href}
                            title={subItem.title}
                          >
                            {subItem.description}
                          </ListItem>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                )
              }

              const navItem = item as NavItem
              return (
                <NavigationMenuItem key={index}>
                  {navItem.href.startsWith('/') &&
                  !navItem.href.includes('#') ? (
                    <Link
                      to={navItem.href}
                      className={
                        navigationMenuTriggerStyle() +
                        ' bg-transparent text-gray-300 hover:text-public-accent hover:bg-public-nav-hover text-sm uppercase tracking-wider font-semibold'
                      }
                    >
                      {navItem.title}
                    </Link>
                  ) : (
                    <a
                      href={navItem.href}
                      className={
                        navigationMenuTriggerStyle() +
                        ' bg-transparent text-gray-300 hover:text-public-accent hover:bg-public-nav-hover text-sm uppercase tracking-wider font-semibold'
                      }
                    >
                      {navItem.title}
                    </a>
                  )}
                </NavigationMenuItem>
              )
            })}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <Link
            to={mobilePrimaryCta.href}
            className={cn(
              'md:hidden inline-flex items-center justify-center rounded border border-public-cta bg-public-cta px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-public-cta-fg transition-colors',
            )}
            onClick={() => setMobileMenuOpen(false)}
          >
            <ChevronRight className="w-4 h-4" />
          </Link>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded border border-public-accent/30 p-2 text-public-accent transition-colors hover:bg-public-accent/10"
            aria-label={
              mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'
            }
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          {ctaItems.map((cta, index) => {
            if (cta.external) {
              return (
                <a
                  key={index}
                  href={cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden md:inline-flex px-6 py-2.5 bg-public-cta hover:bg-public-cta/90 text-public-cta-fg text-sm font-bold uppercase tracking-wider rounded transition-colors shadow-[0_0_15px_rgba(246,200,78,0.3)] hover:shadow-[0_0_25px_rgba(246,200,78,0.5)] items-center justify-center"
                >
                  {cta.title}
                </a>
              )
            }
            const isDashboard = cta.href === '/dashboard'
            return (
              <Link
                key={index}
                to={cta.href}
                className={cn(
                  'hidden md:inline-flex px-6 py-2.5 text-sm font-bold uppercase tracking-wider rounded transition-colors items-center justify-center gap-2',
                  isDashboard
                    ? 'bg-public-cta hover:bg-public-cta/90 text-public-cta-fg shadow-[0_0_15px_rgba(246,200,78,0.3)] hover:shadow-[0_0_25px_rgba(246,200,78,0.5)] border-0'
                    : 'bg-transparent border border-public-accent hover:bg-public-accent/10 text-public-accent shadow-[0_0_15px_rgba(246,200,78,0.1)] hover:shadow-[0_0_25px_rgba(246,200,78,0.2)]',
                )}
              >
                {cta.title === 'Sign In' && <LogIn className="w-4 h-4" />}
                {isDashboard && <LayoutDashboard className="w-4 h-4" />}
                {cta.title}
              </Link>
            )
          })}
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-public-border bg-public-card/95 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-2">
            {mobileMenuItems.map((item, index) => {
              if (item.external) {
                return (
                  <a
                    key={`${item.title}-${index}`}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded border border-public-border px-4 py-3 text-sm font-bold uppercase tracking-wider text-gray-200 transition-colors hover:border-public-accent/50 hover:text-public-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.title}
                    <ChevronRight className="w-4 h-4" />
                  </a>
                )
              }

              return (
                <Link
                  key={`${item.title}-${index}`}
                  to={item.href}
                  className="flex items-center justify-between rounded border border-public-border px-4 py-3 text-sm font-bold uppercase tracking-wider text-gray-200 transition-colors hover:border-public-accent/50 hover:text-public-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.title}
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </header>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-public-nav-hover/80 hover:text-public-accent focus:bg-public-nav-hover focus:text-public-accent border border-transparent hover:border-public-accent/50',
            className,
          )}
          {...props}
        >
          <div className="text-sm font-bold uppercase tracking-tight text-white mb-1">
            {title}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-gray-400 font-medium">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = 'ListItem'
