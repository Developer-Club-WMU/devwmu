import { ArrowUpRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface CommunityCardProps {
  name: string
  description: string
  icon: React.ReactNode
  bgImage: string
  ctaUrl: string
  className?: string
}

export function CommunityCard({
  name,
  description,
  icon,
  bgImage,
  ctaUrl,
  className,
}: CommunityCardProps) {
  return (
    <Card
      className={cn(
        'group relative overflow-hidden rounded-none border-0 bg-public-card transition-all duration-500 hover:shadow-[0_0_40px_rgba(246,200,78,0.15)] md:h-[400px] h-[300px]',
        className,
      )}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt={name}
          className="h-full w-full object-cover opacity-30 transition-all duration-700 group-hover:scale-105 group-hover:opacity-50 grayscale group-hover:grayscale-0"
        />
        {/* Subtle gradient overlay to darken the bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-public-bg via-public-bg/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
      </div>

      <a
        href={ctaUrl}
        className="relative z-10 block h-full p-6 md:p-8 flex flex-col justify-end"
      >
        <CardContent className="p-0">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded bg-public-glow/60 text-public-accent backdrop-blur-md transition-all duration-300 group-hover:bg-public-accent group-hover:text-public-bg border border-public-glow group-hover:border-public-accent shadow-lg">
            {icon}
          </div>

          <h3 className="mb-2 text-3xl font-black uppercase tracking-tighter text-white md:text-4xl transition-transform group-hover:-translate-y-1 duration-300">
            {name}
          </h3>

          <p className="mb-6 line-clamp-3 text-sm text-public-fg/80 md:text-base font-medium transition-all group-hover:-translate-y-1 duration-300 opacity-90 group-hover:opacity-100">
            {description}
          </p>

          <div className="mt-auto flex items-center font-bold text-public-accent transition-all opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 duration-300">
            <span className="uppercase tracking-wider text-sm">
              Explore {name}
            </span>
            <ArrowUpRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </div>
        </CardContent>
      </a>

      {/* League style border accents */}
      <div className="absolute top-0 left-0 w-8 h-[2px] bg-public-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute top-0 left-0 w-[2px] h-8 bg-public-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="absolute bottom-0 right-0 w-8 h-[2px] bg-public-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-0 right-0 w-[2px] h-8 bg-public-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Bottom glowing border */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-public-accent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </Card>
  )
}
