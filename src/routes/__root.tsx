import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Dev WMU',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  errorComponent: (props) => {
    return (
      <RootDocument>
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-slate-900 border border-red-500/30 p-8 rounded-none shadow-2xl backdrop-blur-xl relative">
            <div className="absolute top-0 left-0 w-8 h-[2px] bg-red-500" />
            <div className="absolute top-0 left-0 w-[2px] h-8 bg-red-500" />
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">Error</h1>
            <p className="text-slate-400 mb-6 font-medium">
              {props.error instanceof Error ? props.error.message : 'An unexpected error occurred.'}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-500 text-white font-bold uppercase tracking-widest hover:bg-red-600 transition-colors shadow-[0_0_15px_rgba(239,68,68,0.3)]"
            >
              Retry
            </button>
          </div>
        </div>
      </RootDocument>
    )
  },
  notFoundComponent: () => {
    return (
      <RootDocument>
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-slate-900 border border-wmu-gold/30 p-8 rounded-none shadow-2xl backdrop-blur-xl relative">
            <div className="absolute top-0 left-0 w-8 h-[2px] bg-wmu-gold" />
            <div className="absolute top-0 left-0 w-[2px] h-8 bg-wmu-gold" />
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">404</h1>
            <p className="text-slate-400 mb-6 font-medium uppercase tracking-widest">Route Not Found</p>
            <a 
              href="/"
              className="inline-block px-6 py-3 bg-wmu-gold text-slate-950 font-bold uppercase tracking-widest hover:bg-white transition-colors shadow-[0_0_15px_rgba(246,200,78,0.3)]"
            >
              Go Home
            </a>
          </div>
        </div>
      </RootDocument>
    )
  },
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
