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
import { Terminal } from 'lucide-react'
import React from 'react'
import { cn } from '@/lib/utils'
import { navigationConfig } from '@/config/navigation'
import type { NavGroup, NavItem } from '@/config/navigation'

export function NavBar() {
  return (
    <header className="fixed top-0 w-full z-50 bg-public-bg/80 backdrop-blur-md border-b border-public-border">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <Terminal className="w-8 h-8 text-public-accent transition-transform group-hover:scale-110" />
          <span className="text-2xl font-black text-white tracking-tighter uppercase pl-1">
            DEV CLUB <span className="text-public-accent">WMU</span>
          </span>
        </Link>

        <NavigationMenu>
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

        <div className="flex items-center gap-4">
          {navigationConfig.public.cta.map((cta, index) => {
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
            return (
              <Link
                key={index}
                to={cta.href}
                className="hidden md:inline-flex px-6 py-2.5 bg-transparent border border-public-accent hover:bg-public-accent/10 text-public-accent text-sm font-bold uppercase tracking-wider rounded transition-colors shadow-[0_0_15px_rgba(246,200,78,0.1)] hover:shadow-[0_0_25px_rgba(246,200,78,0.2)] items-center justify-center"
              >
                {cta.title}
              </Link>
            )
          })}
        </div>
      </div>
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
