import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Building2, Package, Users,
  LogOut, ChevronRight, Sparkles
} from 'lucide-react'

const navItems = [
  { to: '/',         label: 'Dashboard',  icon: LayoutDashboard },
  { to: '/tenants',  label: 'Tenants',    icon: Building2 },
  { to: '/plans',    label: 'Plans',      icon: Package },
]

export default function Layout({ children }) {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className="flex min-h-screen bg-bg">
      {/* SIDEBAR */}
      <aside className="fixed top-0 left-0 bottom-0 w-60 flex flex-col bg-surface border-r border-border z-50">

        {/* LOGO */}
        <div className="px-5 py-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent2 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-display font-extrabold text-base gradient-text leading-none">
                Decolivings
              </div>
              <div className="text-[10px] text-muted uppercase tracking-widest mt-0.5">
                Super Admin
              </div>
            </div>
          </div>
        </div>

        {/* NAV */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <p className="text-[10px] font-bold text-muted uppercase tracking-widest px-3 mb-2">
            Navigation
          </p>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group',
                isActive
                  ? 'bg-accent/15 text-accent'
                  : 'text-muted hover:bg-surface2 hover:text-white'
              )}
            >
              {({ isActive }) => (
                <>
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="flex-1">{label}</span>
                  {isActive && <ChevronRight className="w-3 h-3" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* FOOTER */}
        <div className="px-3 pb-4 border-t border-border pt-4">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-surface2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent2 flex items-center justify-center font-display font-bold text-sm text-white shrink-0">
              {admin?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{admin?.name || 'Admin'}</p>
              <p className="text-[11px] text-muted truncate">{admin?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-md text-muted hover:text-danger hover:bg-danger/10 transition-colors"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="ml-60 flex-1 p-8 min-h-screen">
        {children}
      </main>
    </div>
  )
}
