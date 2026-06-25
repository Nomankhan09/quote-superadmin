import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

import {
  LayoutDashboard,
  Building2,
  Package,
  LogOut,
  ChevronRight,
  Sparkles,
  Globe,
  Users,
} from 'lucide-react'

const navItems = [
  {
    to: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    to: '/apps',
    label: 'Apps',
    icon: Globe,
  },
  {
    to: '/users',
    label: 'Users',
    icon: Users,
  },
  {
    to: '/access-requests',
    label: 'Access Requests',
    icon: Sparkles,
  },
  {
    to: '/tenants',
    label: 'Tenants',
    icon: Building2,
  },
  {
    to: '/plans',
    label: 'Plans',
    icon: Package,
  },
]

export default function Layout({
  children,
}) {

  const { admin, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen bg-[#F5F7FB]">

      {/* SIDEBAR */}
      <aside
        className="  fixed  top-0  left-0  bottom-0  w-64  flex  flex-col  bg-[#F8FAFC]  border-r  border-slate-200/70  z-50"
      >

        {/* LOGO */}
        <div
          className=" px-6 py-6 border-b border-slate-100"
        >

          <div className="flex items-center gap-3">
            <div className="relative">
              {/* Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-violet-500 rounded-2xl blur-xl opacity-25"></div>

              {/* Logo Container */}
              <div
                className="
      relative
      w-11 h-11
      rounded-xl
      bg-white
      border border-slate-200
      flex items-center justify-center
      shadow-[0_10px_30px_rgba(59,130,246,0.20)]
    "
              >
                <img
                  src="/src/public/images/flairm-crm-logo.png"
                  alt="Flairm"
                  className="w-8 h-8 object-contain"
                />
              </div>
            </div>

            <div>
              <div className=" font-black text-lg text-slate-900 tracking-tight">
                Flairm
              </div>
              <div
                className=" text-[10px] text-slate-400 uppercase tracking-[0.25em] mt-0.5 font-bold"
              >
                Super Admin
              </div>
            </div>
          </div>
        </div>

        {/* NAV */}
        <nav
          className=" flex-1 px-3 py-5"
        >

          <p
            className=" text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em] px-3 mb-3"
          >
            Navigation
          </p>

          <div className="space-y-1">

            {navItems.map(
              ({
                to, label, icon: Icon,
              }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}

                  className={({
                    isActive,
                  }) =>
                    cn(
                      `flex items-center gap-3
                      px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-150
                      `,

                      isActive
                        ? `
                          bg-[#EEF4FF]
                          text-blue-600
                          shadow-sm
                        `
                        : `
                          text-slate-500
                          hover:bg-slate-100
                          hover:text-slate-900
                        `
                    )
                  }
                >

                  {({ isActive }) => (
                    <>

                      <Icon
                        className=" w-4 h-4 shrink-0"
                      />

                      <span className="flex-1">
                        {label}
                      </span>

                      {isActive && (
                        <ChevronRight
                          className=" w-4 h-4"
                        />
                      )}

                    </>
                  )}

                </NavLink>
              )
            )}

          </div>

        </nav>

        {/* FOOTER */}
        <div
          className=" px-4 pb-5 pt-4 border-t border-slate-100"
        >

          <div
            className=" flex items-center gap-3 px-3 py-3 rounded-2xl bg-[#F5F7FB] border border-slate-200/70"
          >

            <div
              className="
                w-10
                h-10

                rounded-xl

                bg-gradient-to-br
                from-blue-600
                to-indigo-500

                flex
                items-center
                justify-center

                text-white
                font-bold
                text-sm

                shrink-0
              "
            >
              {admin?.name
                ?.charAt(0)
                ?.toUpperCase() || 'A'}
            </div>

            <div className="flex-1 min-w-0">

              <p
                className="
                  text-sm
                  font-bold
                  text-slate-900
                  truncate
                "
              >
                {admin?.name || 'Admin'}
              </p>

              <p
                className="
                  text-xs
                  text-slate-500
                  truncate
                "
              >
                {admin?.email}
              </p>

            </div>

            <button
              onClick={handleLogout}

              className="
                p-2

                rounded-lg

                text-slate-400

                hover:bg-red-50
                hover:text-red-500

                transition-colors
              "

              title="Logout"
            >
              <LogOut
                className="
                  w-4
                  h-4
                "
              />
            </button>

          </div>

        </div>

      </aside>

      {/* MAIN */}
      <main
        className="ml-64 flex-1 min-h-screen p-8 "
      >
        {children}
      </main>

    </div>
  )
}