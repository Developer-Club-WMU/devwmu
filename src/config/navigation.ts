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
}

export const navigationConfig: NavigationConfig = {
  public: {
    mainNav: [
      {
        title: 'Home',
        href: '/',
      },
      {
        title: 'Communities',
        items: [
          {
            title: 'Web Dev',
            href: '/#web',
            description:
              'Build modern web applications and frontend experiences.',
          },
          {
            title: 'App Dev',
            href: '/#app',
            description: 'Create mobile applications for iOS and Android.',
          },
          {
            title: 'Systems',
            href: '/#systems',
            description:
              'Dive deep into low-level programming and infrastructure.',
          },
          {
            title: 'Game Dev',
            href: '/#games',
            description: 'Design and develop interactive game experiences.',
          },
        ],
      },
      {
        title: 'Events',
        href: '#',
      },
    ],
    cta: [
      {
        title: 'Sign In',
        href: '/sign-in',
      },
      {
        title: 'Join Discord',
        href: 'https://discord.com/invite/q9gk2MasBC',
        external: true,
      },
    ],
    social: [
      {
        title: 'Discord',
        href: 'https://discord.com/invite/q9gk2MasBC',
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
        title: 'Overview',
        href: '/app',
      },
      {
        title: 'Members',
        href: '/app', // Pending actual route
      },
      {
        title: 'Events',
        href: '/app/events',
      },
    ],
  },
}
