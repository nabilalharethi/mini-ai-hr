import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1b2e 40%, #0a1628 70%, #0d2137 100%)',
      display: 'flex',
    }}>
      {/* Background circuit pattern */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <svg style={{ width: '100%', height: '100%', opacity: 0.06 }} xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="120" x2="600" y2="120" stroke="#00d4ff" strokeWidth="1" />
          <line x1="0" y1="280" x2="400" y2="280" stroke="#00d4ff" strokeWidth="1" />
          <line x1="200" y1="450" x2="800" y2="450" stroke="#00d4ff" strokeWidth="1" />
          <line x1="900" y1="200" x2="1500" y2="200" stroke="#00d4ff" strokeWidth="1" />
          <line x1="1000" y1="380" x2="1500" y2="380" stroke="#00d4ff" strokeWidth="1" />
          <line x1="150" y1="0" x2="150" y2="400" stroke="#00d4ff" strokeWidth="1" />
          <line x1="350" y1="200" x2="350" y2="700" stroke="#00d4ff" strokeWidth="1" />
          <line x1="1200" y1="0" x2="1200" y2="350" stroke="#00d4ff" strokeWidth="1" />
          <line x1="1380" y1="150" x2="1380" y2="600" stroke="#00d4ff" strokeWidth="1" />
          <path d="M150 120 L150 200 L350 200" stroke="#00d4ff" strokeWidth="1" fill="none" />
          <path d="M350 280 L350 380 L1200 380" stroke="#00d4ff" strokeWidth="1" fill="none" />
          <path d="M1200 200 L1380 200 L1380 380" stroke="#00d4ff" strokeWidth="1" fill="none" />
          {[150,120,350,280,80,600,1200,200,1380,380].reduce((acc, _, i, arr) => {
            if (i % 2 === 0) acc.push([arr[i], arr[i+1]])
            return acc
          }, [] as number[][]).map(([x,y], i) => (
            <circle key={i} cx={x} cy={y} r="3" fill="#00d4ff" />
          ))}
        </svg>
        {/* Glow orbs */}
        <div style={{
          position: 'absolute', width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(0,150,255,0.05) 0%, transparent 70%)',
          top: '-100px', left: '200px', borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute', width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%)',
          bottom: '100px', right: '100px', borderRadius: '50%',
        }} />
      </div>

      <Sidebar userEmail={user.email ?? ''} />
      <main style={{ flex: 1, marginLeft: '260px', padding: '32px', position: 'relative', zIndex: 1 }}>
        {children}
      </main>
    </div>
  )
}