import { createFileRoute } from '@tanstack/react-router'
import { Target, Rocket, Users, History, UserCheck, Zap, Globe, Lightbulb } from 'lucide-react'

export const Route = createFileRoute('/_public/about/')({
  component: AboutPage,
})

function AboutPage() {
  return (
    <div className="min-h-screen bg-public-bg font-sans selection:bg-public-accent/30 pt-32 md:pt-48 pb-24 relative overflow-hidden">
      {/* Abstract atmospheric glow */}
      <div className="absolute top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-public-glow/20 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-public-accent/5 blur-[100px] pointer-events-none"></div>

      <div className="container relative mx-auto px-6 max-w-5xl z-10">
        {/* Hero Section */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-public-accent/10 border border-public-accent/20 mb-6 group transition-all hover:bg-public-accent/20">
            <Zap className="w-4 h-4 text-public-accent fill-public-accent" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-public-accent">The Innovation Hub</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-8 leading-none">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-public-accent via-white to-white">The Club</span>
          </h1>
          <div className="w-24 h-1 bg-public-accent mx-auto mb-10" />
        </div>

        {/* Mission Section */}
        <section className="mb-32 relative group">
          <div className="absolute -inset-4 bg-gradient-to-r from-public-glow/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10" />
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/3 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-public-accent blur-2xl opacity-20 animate-pulse" />
                <div className="relative h-40 w-40 flex items-center justify-center rounded-2xl bg-public-card border border-public-border text-public-accent shadow-2xl">
                  <Target className="w-20 h-20" />
                </div>
              </div>
            </div>
            <div className="md:w-2/3">
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-6 flex items-center gap-3">
                <span className="text-public-accent">🔥</span> Our Mission
              </h2>
              <p className="text-xl md:text-2xl text-slate-300 font-medium leading-relaxed italic border-l-4 border-public-accent pl-6">
                "A student-led innovation hub on a mission to empower tech enthusiasts to grow through collaboration, creativity, and real-world development experience."
              </p>
            </div>
          </div>
        </section>

        {/* Goals Grid */}
        <section className="mb-32">
          <div className="flex items-center gap-4 mb-12">
             <Rocket className="w-8 h-8 text-public-accent" />
             <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Our Goals</h2>
             <div className="flex-grow h-px bg-gradient-to-r from-public-border to-transparent" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <GoalCard 
              icon={<Lightbulb className="w-8 h-8 text-public-accent" />}
              title="Build Real Projects"
              description="Launch apps, websites, and AI tools that make a difference."
            />
            <GoalCard 
              icon={<Globe className="w-8 h-8 text-public-accent" />}
              title="Learn & Grow Together"
              description="Host workshops, hackathons & mentoring sessions to boost your skills."
            />
            <GoalCard 
              icon={<Users className="w-8 h-8 text-public-accent" />}
              title="Connect & Collaborate"
              description="Network with fellow devs, alumni, and industry pros."
            />
          </div>
        </section>

        {/* Origin Story */}
        <section className="mb-32 relative">
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 select-none opacity-5">
            <History className="w-64 h-64 text-white" />
          </div>
          <div className="bg-public-card backdrop-blur-xl border border-public-border p-8 md:p-12 rounded-none relative overflow-hidden">
            <div className="absolute top-0 left-0 w-12 h-[2px] bg-public-accent" />
            <div className="absolute top-0 left-0 w-[2px] h-12 bg-public-accent" />
            
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-8 flex items-center gap-3">
              <History className="w-8 h-8 text-public-accent" />
              📖 Our Origin Story
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-slate-300 font-medium leading-relaxed">
                A few curious students at Western Michigan University came together with a shared passion for tech and a dream to build cool stuff. What started as casual coding sessions turned into a thriving community of developers pushing boundaries in Web, AI, and App development.
              </p>
            </div>
          </div>
        </section>

        {/* Who is it for */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">
              <span className="text-public-accent">👩‍💻</span> Who's This Club For?
            </h2>
            <p className="text-slate-400 font-medium tracking-wide uppercase text-sm">Join the ranks of WMU innovators</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AudienceItem text="Anyone curious about web, AI, or app development" />
            <AudienceItem text="Beginners looking to learn by doing" />
            <AudienceItem text="Experienced devs ready to lead or mentor" />
            <AudienceItem text="Students from any major (not just CS)" />
          </div>
        </section>
      </div>
    </div>
  )
}

function GoalCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="group p-8 bg-public-card border border-public-border transition-all duration-500 hover:border-public-accent/50 hover:-translate-y-2">
      <div className="mb-6 p-3 rounded-lg bg-public-bg inline-block border border-public-border group-hover:bg-public-accent/10 group-hover:border-public-accent/30 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-black text-white uppercase tracking-tight mb-4 group-hover:text-public-accent transition-colors">{title}</h3>
      <p className="text-slate-400 font-medium group-hover:text-slate-200 transition-colors">{description}</p>
    </div>
  )
}

function AudienceItem({ text }: { text: string }) {
  return (
    <div className="p-6 bg-public-card/40 border border-public-border rounded-lg flex flex-col items-center text-center group hover:bg-public-card transition-colors">
      <div className="mb-4 text-public-accent group-hover:scale-110 transition-transform">
        <UserCheck className="w-8 h-8" />
      </div>
      <p className="text-slate-300 font-bold tracking-tight text-sm uppercase">{text}</p>
    </div>
  )
}
