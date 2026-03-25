import { createFileRoute } from '@tanstack/react-router'
import { CommunityCard } from '@/components/CommunityCard'
import {
  Globe,
  Smartphone,
  Server,
  Gamepad2,
  ChevronRight,
  Terminal,
} from 'lucide-react'
import { navigationConfig } from '@/config/navigation'

export const Route = createFileRoute('/_public/')({ component: App })

const communities = [
  {
    id: 'web',
    name: 'Web.Dev',
    description:
      'Master modern frontend and backend web technologies. Build responsive, accessible, and performant web applications using React, Node.js, and more.',
    icon: <Globe className="w-6 h-6" />,
    bgImage:
      'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop', // Code on screen
    ctaUrl: '#web',
  },
  {
    id: 'app',
    name: 'App.Dev',
    description:
      'Create native and cross-platform mobile experiences. Learn iOS, Android, Flutter, and React Native development from the ground up.',
    icon: <Smartphone className="w-6 h-6" />,
    bgImage:
      'https://images.unsplash.com/photo-1526498460520-4c246339dccb?q=80&w=2070&auto=format&fit=crop', // Phone app code
    ctaUrl: '#app',
  },
  {
    id: 'systems',
    name: 'Sys.Dev',
    description:
      'Dive deep into low-level programming, infrastructure, and cloud computing. Explore Linux, Rust, DevOps, and scalable systems architecture.',
    icon: <Server className="w-6 h-6" />,
    bgImage:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2034&auto=format&fit=crop', // Server racks
    ctaUrl: '#systems',
  },
  {
    id: 'games',
    name: 'Game.Dev',
    description:
      'Design and develop interactive experiences. Craft gameplay mechanics, render graphics, and build immersive worlds using Unity and Unreal Engine.',
    icon: <Gamepad2 className="w-6 h-6" />,
    bgImage:
      'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=2070&auto=format&fit=crop', // Gaming setup / controller
    ctaUrl: '#games',
  },
]

function App() {
  return (
    <div className="min-h-screen bg-public-bg font-sans selection:bg-public-accent/30 text-public-fg">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden min-h-[85vh] flex items-center border-b border-public-border">
        {/* Dark moody background with abstract gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-public-glow/20 via-public-bg to-public-bg"></div>
        <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-public-accent/20 to-transparent"></div>

        {/* Abstract atmospheric glow */}
        <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-public-glow/30 blur-[120px] pointer-events-none"></div>
        <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-public-glow/10 blur-[100px] pointer-events-none"></div>

        <div className="container relative mx-auto px-6 max-w-7xl">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded bg-public-accent/10 border border-public-accent/30 text-public-accent text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-md shadow-lg shadow-public-accent/10">
              <Terminal className="w-3.5 h-3.5" />
              <span>Forging Engineers</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.9] mb-6 drop-shadow-2xl">
              Code.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-public-accent via-white to-white">
                Create.
              </span>
              <br />
              Conquer.
            </h1>

            <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl font-medium leading-relaxed">
              The Developer Club WMU is an elite student organization dedicated
              to building software engineers through hands-on projects,
              workshops, and competitive development.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
              <a
                href="#communities"
                className="group relative inline-flex items-center justify-center px-8 py-4 font-bold uppercase tracking-widest text-public-cta-fg bg-public-cta overflow-hidden transition-all shadow-[0_0_20px_rgba(246,200,78,0.4)] hover:shadow-[0_0_40px_rgba(246,200,78,0.6)]"
              >
                <div className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <span className="relative">Choose Your Path</span>
                <ChevronRight className="relative ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />

                {/* Decorative border cut */}
                <div className="absolute top-0 right-0 border-t-[8px] border-l-[8px] border-t-public-bg border-l-transparent"></div>
                <div className="absolute bottom-0 left-0 border-b-[8px] border-r-[8px] border-b-public-bg border-r-transparent"></div>
              </a>

              <a
                href="https://discord.gg/wmu-dev-club"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center px-8 py-4 font-bold uppercase tracking-widest text-public-accent bg-transparent border border-public-accent/30 hover:border-public-accent transition-colors"
              >
                <span className="relative z-10">Join Discord</span>
                <div className="absolute inset-0 bg-public-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Communities Section */}
      <section
        id="communities"
        className="py-24 bg-public-bg relative border-t border-public-border"
      >
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="w-8 h-[2px] bg-public-accent"></div>
                <span className="text-public-accent font-bold uppercase tracking-widest text-sm">
                  Specializations
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
                Our{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-public-accent via-white to-white">
                  Factions
                </span>
              </h2>
              <p className="text-slate-400 max-w-xl font-medium">
                Join specialized communities focused on different areas of
                software engineering. Learn, build, and level up together.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 relative z-10">
            {communities.map((community) => (
              <CommunityCard
                key={community.id}
                name={community.name}
                description={community.description}
                icon={community.icon}
                bgImage={community.bgImage}
                ctaUrl={community.ctaUrl}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-public-border bg-public-bg text-center relative overflow-hidden">
        {/* Glow effect for footer */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[50%] h-[100px] bg-public-glow/20 blur-[50px] pointer-events-none"></div>
        <div className="container relative mx-auto px-6 z-10">
          <div className="flex items-center justify-center gap-2 mb-6 opacity-50 hover:opacity-100 transition-opacity">
            <Terminal className="w-5 h-5 text-public-accent" />
            <span className="text-sm font-black text-public-accent tracking-widest uppercase">
              Dev Club WMU
            </span>
          </div>

          <div className="flex items-center justify-center gap-6 mb-6 relative z-10">
            {navigationConfig.public.social.map((social, index) => {
              if (!social.icon) return null
              const Icon = social.icon
              return (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 hover:text-public-accent transition-colors hover:scale-110 transform duration-200"
                  aria-label={social.title}
                >
                  <Icon className="w-6 h-6" />
                </a>
              )
            })}
          </div>

          <p className="text-slate-600 text-xs font-semibold uppercase tracking-wider">
            &copy; {new Date().getFullYear()} Developer Club Western Michigan
            University.
          </p>
        </div>
      </footer>
    </div>
  )
}
