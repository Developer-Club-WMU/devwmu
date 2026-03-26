import { createFileRoute, Link } from '@tanstack/react-router'
import { ShieldAlert, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/unauthorized')({
  component: UnauthorizedPage,
})

function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-public-bg text-public-fg overflow-hidden relative selection:bg-public-accent/30">
      {/* Aesthetic Glows */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-public-glow/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-public-glow/10 blur-[120px] pointer-events-none" />
      
      <div className="max-w-md w-full text-center space-y-8 relative z-10">
        <div className="flex justify-center">
          <div className="p-6 bg-public-accent/10 rounded-3xl border border-public-accent/20 backdrop-blur-xl shadow-[0_0_30px_rgba(246,200,78,0.1)]">
            <ShieldAlert className="w-16 h-16 text-public-accent" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-5xl font-black tracking-tight uppercase italic text-public-fg">
            Access <span className="text-public-accent">Denied</span>
          </h1>
          <p className="text-public-fg/60 font-medium leading-relaxed">
            Ouch! It looks like you're trying to access a space where you don't have the required permissions. Ready to head back to safety?
          </p>
        </div>

        <div className="flex justify-center pt-4">
          <Button asChild className="h-12 px-10 font-black uppercase tracking-widest shadow-[0_0_20px_rgba(246,200,78,0.3)] hover:shadow-[0_0_40px_rgba(246,200,78,0.5)] bg-public-cta text-public-cta-fg hover:opacity-90 transition-all rounded-xl border-0">
            <Link to="/">
               <Home className="w-4 h-4 mr-2" /> Return Home
            </Link>
          </Button>
        </div>

        <div className="pt-12 text-[10px] font-black uppercase tracking-[0.3em] text-public-fg/30">
          Dev Club @ Western Michigan University
        </div>
      </div>
    </div>
  )
}
