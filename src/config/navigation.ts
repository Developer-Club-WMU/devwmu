import type { IconType } from 'react-icons'
import { FaDiscord, FaLinkedin, FaInstagram } from 'react-icons/fa'

export interface NavItem {
  title: string
  href: string
  description?: string
  external?: boolean
  icon?: IconType
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

export interface NavigationConfig {
  public: {
    mainNav: (NavItem | NavGroup)[]
    cta: NavItem[]
    social: NavItem[]
  }
  app: {
    mainNav: NavItem[]
  }
  member: {
    mainNav: NavItem[]
  }
}

export const navigationConfig: NavigationConfig = {
  public: {
    mainNav: [
      {
        title: 'About',
        href: '/about',
      },
    ],
    cta: [
      {
        title: 'Sign In',
        href: '/sign-in',
      },
      {
        title: 'Join Discord',
        href: 'https://discord.com/invite/G9yE5s6NFM',
        external: true,
      },
      {
        title: 'View Events',
        href: '/events',
      },
    ],
    social: [
      {
        title: 'Discord',
        href: 'https://discord.com/invite/G9yE5s6NFM',
        icon: FaDiscord,
        external: true,
      },
      {
        title: 'LinkedIn',
        href: 'https://www.linkedin.com/company/developer-club-wmu/',
        icon: FaLinkedin,
        external: true,
      },
      {
        title: 'Instagram',
        href: 'https://www.instagram.com/developerclubwmu',
        icon: FaInstagram,
        external: true,
      },
    ],
  },
  app: {
    mainNav: [
      {
        title: 'Members',
        href: '/app/members', // Pending actual route
      },
      {
        title: 'Events',
        href: '/app/events',
      },
    ],
  },
  member: {
    mainNav: [
      {
        title: 'Dashboard',
        href: '/member',
      },
    ],
  },
}
