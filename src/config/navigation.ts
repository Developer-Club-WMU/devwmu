export interface NavItem {
  title: string
  href: string
  description?: string
  external?: boolean
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

export interface NavigationConfig {
  public: {
    mainNav: (NavItem | NavGroup)[]
    cta: NavItem[]
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
        href: 'https://discord.gg/wmu-dev-club',
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
        href: '/app', // Pending actual route
      },
    ],
  },
}
