import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTenants, getPlans } from '@/services/api'
import { StatCard, Card, CardHeader, CardTitle, CardBody, Skeleton, Badge } from '@/components/ui'
import { formatDate, formatCurrency } from '@/lib/utils'
import { Building2, Package, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export default function Dashboard() {
  const [tenants, setTenants] = useState([])
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([getTenants(), getPlans()])
      .then(([td, pd]) => {
        setTenants(td.data.tenants || [])
        setPlans(pd.data.plans || [])
      })
      .finally(() => setLoading(false))
  }, [])

  const stats = {
    total: tenants.length,
    active: tenants.filter(t => t.status === 'active').length,
    trial: tenants.filter(t => t.status === 'trial').length,
    suspended: tenants.filter(t => t.status === 'suspended').length,
  }

  const chartData = plans.map(p => ({
    name: p.name,
    tenants: tenants.filter(t => t.plan_id === p.id).length,
  }))

  const recent = [...tenants].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5)

  return (
    <div className="animate-fadeIn space-y-6">
      {/* HEADER */}
      <div className="flex items-end justify-between">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1 font-medium">Platform overview — {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-4 gap-5">
        {loading ? (
          Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-32" />)
        ) : (
          <>
            <StatCard icon="🏢" label="Total Tenants" value={stats.total} color="accent" />
            <StatCard icon="✅" label="Active" value={stats.active} color="success" />
            <StatCard icon="⏳" label="On Trial" value={stats.trial} color="warning" />
            <StatCard icon="🚫" label="Suspended" value={stats.suspended} color="danger" />
          </>
        )}
      </div>

      {/* CHARTS + RECENT */}
      <div className="grid grid-cols-5 gap-6">

        {/* BAR CHART */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Tenants by Plan</CardTitle>
          </CardHeader>
          <CardBody>
            {loading ? <Skeleton className="h-48" /> : (
              chartData.length === 0 ? (
                <div className="flex items-center justify-center h-48 text-slate-500 text-sm">No data yet</div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData} barSize={36}>
                    <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        background: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: 12,
                        color: '#0F172A',
                        fontSize: 12,
                        boxShadow:
                          '0 10px 30px rgba(15,23,42,0.08)',
                      }} cursor={{ fill: 'rgba(124,106,247,0.08)' }}
                    />
                    <Bar dataKey="tenants" radius={[6, 6, 0, 0]}>
                      {chartData.map((_, i) => (
                        <Cell key={i} fill={
                          i % 2 === 0
                            ? '#3B82F6'
                            : '#8B5CF6'
                        } />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )
            )}
          </CardBody>
        </Card>

        {/* STATUS BREAKDOWN */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Status Breakdown</CardTitle>
          </CardHeader>
          <CardBody className="space-y-3">
            {loading ? <Skeleton className="h-40" /> : (
              [
                { label: 'Active', val: stats.active, color: 'bg-success', status: 'active' },
                { label: 'Trial', val: stats.trial, color: 'bg-warning', status: 'trial' },
                { label: 'Suspended', val: stats.suspended, color: 'bg-danger', status: 'suspended' },
              ].map(row => (
                <div key={row.label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-500 font-medium">{row.label}</span>
                    <span className="font-bold">{stats.total > 0 ? Math.round((row.val / stats.total) * 100) : 0}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${row.color}`}
                      style={{ width: stats.total > 0 ? `${(row.val / stats.total) * 100}%` : '0%' }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardBody>
        </Card>

        {/* RECENT TENANTS */}
        <Card className="col-span-5">
          <CardHeader>
            <CardTitle>Recent Tenants</CardTitle>
            <button
              onClick={() => navigate('/tenants')}
              className="flex items-center gap-1.5 text-xs text-accent hover:text-accent-light transition-colors font-semibold"
            >
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </CardHeader>
          <div>
            {loading ? (
              <div className="p-5 space-y-3">
                {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-10" />)}
              </div>
            ) : recent.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-sm">No tenants yet</div>
            ) : (
              <table className="w-full border-separate border-spacing-0">
                <thead>
                  <tr className="border-b border-slate-200">
                    {['Business', 'Email', 'Plan', 'Status', 'Joined'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recent.map(t => (
                    <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors cursor-pointer"
                      onClick={() => navigate('/tenants')}>
                      <td className="px-5 py-3.5 font-semibold text-sm">{t.name}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-500">{t.email}</td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full font-semibold">
                          {t.plan?.name || '—'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge status={t.status}>{t.status}</Badge>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-500">{formatDate(t.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
