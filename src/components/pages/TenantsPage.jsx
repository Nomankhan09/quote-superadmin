import { useState, useEffect, useCallback } from 'react'
import {
  getTenants, getPlans, createTenant,
  suspendTenant, activateTenant, deleteTenant,
  getTenantUsers, createTenantUser, updateTenantUser, deleteTenantUser
} from '@/services/api'
import {
  Button, Badge, Card, CardHeader, CardTitle, CardBody,
  Modal, ConfirmDialog, EmptyState, Skeleton, Input, Select
} from '@/components/ui'
import { formatDate, cn } from '@/lib/utils'
import {
  Plus, Search, Eye, UserCog, Trash2,
  ShieldOff, ShieldCheck, X, Users, Mail,
  Phone, Database, Calendar, RefreshCw
} from 'lucide-react'
import { useToast } from '@/hooks/useToast'
import { ToastContainer } from '@/components/ui'

// ── ADD TENANT FORM ───────────────────────────────────────
function AddTenantModal({ open, onClose, plans, onSuccess, toast }) {
  const [form, setForm] = useState({
    name:'', email:'', phone:'', plan_id:'',
    first_name:'', last_name:'', password:''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors]   = useState({})
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.name)       e.name = 'Required'
    if (!form.email)      e.email = 'Required'
    if (!form.plan_id)    e.plan_id = 'Select a plan'
    if (!form.first_name) e.first_name = 'Required'
    if (!form.password || form.password.length < 8) e.password = 'Min 8 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await createTenant({ ...form, plan_id: Number(form.plan_id) })
      toast({ title: 'Tenant created!', description: `${form.name} is now live.` })
      setForm({ name:'', email:'', phone:'', plan_id:'', first_name:'', last_name:'', password:'' })
      onSuccess()
    } catch (err) {
      toast({ title: 'Failed', description: err.response?.data?.message || 'Something went wrong', variant: 'destructive' })
    } finally { setLoading(false) }
  }

  return (
    <Modal open={open} onClose={onClose} title="➕ Add New Tenant" size="lg">
      <form onSubmit={submit} className="space-y-4">
        <Input label="Business Name" placeholder="e.g. Mehta Interiors"
          value={form.name} onChange={set('name')} error={errors.name} />

        <div className="grid grid-cols-2 gap-3">
          <Input label="First Name" placeholder="Owner first name"
            value={form.first_name} onChange={set('first_name')} error={errors.first_name} />
          <Input label="Last Name" placeholder="Last name"
            value={form.last_name} onChange={set('last_name')} />
        </div>

        <Input label="Email" type="email" placeholder="owner@business.com"
          value={form.email} onChange={set('email')} error={errors.email} />

        <div className="grid grid-cols-2 gap-3">
          <Input label="Phone" placeholder="9876543210"
            value={form.phone} onChange={set('phone')} />
          <Select label="Plan" value={form.plan_id} onChange={set('plan_id')} error={errors.plan_id}>
            <option value="">Select plan</option>
            {plans.map(p => (
              <option key={p.id} value={p.id}>{p.name} — ₹{Number(p.price).toLocaleString()}/mo</option>
            ))}
          </Select>
        </div>

        <Input label="Password" type="password" placeholder="Min 8 characters"
          value={form.password} onChange={set('password')} error={errors.password} />

        <div className="flex gap-3 justify-end pt-2 border-t border-border">
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading}>Create Tenant</Button>
        </div>
      </form>
    </Modal>
  )
}

// ── TENANT DETAIL MODAL ───────────────────────────────────
function TenantDetailModal({ open, onClose, tenant }) {
  if (!tenant) return null
  const fields = [
    { icon: Mail,     label: 'Email',      val: tenant.email },
    { icon: Phone,    label: 'Phone',      val: tenant.phone || '—' },
    { icon: Database, label: 'Database',   val: tenant.db_name },
    { icon: Calendar, label: 'Trial Ends', val: formatDate(tenant.trial_ends_at) },
    { icon: Calendar, label: 'Created',    val: formatDate(tenant.created_at) },
  ]
  return (
    <Modal open={open} onClose={onClose} size="md">
      <div className="flex items-start gap-4 mb-5">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-accent2 flex items-center justify-center font-display font-bold text-xl text-white shrink-0">
          {tenant.name?.charAt(0)}
        </div>
        <div>
          <h2 className="font-display font-bold text-xl">{tenant.name}</h2>
          <Badge status={tenant.status}>{tenant.status}</Badge>
          <span className="ml-2 text-xs text-accent font-semibold">{tenant.plan?.name}</span>
        </div>
      </div>
      <div className="space-y-0 divide-y divide-border rounded-lg border border-border overflow-hidden">
        {fields.map(({ icon: Icon, label, val }) => (
          <div key={label} className="flex items-center gap-3 px-4 py-3 bg-surface2">
            <Icon className="w-3.5 h-3.5 text-muted shrink-0" />
            <span className="text-xs text-muted w-20 shrink-0">{label}</span>
            <span className="text-sm font-mono text-white truncate">{val}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-5">
        <Button variant="ghost" onClick={onClose}>Close</Button>
      </div>
    </Modal>
  )
}

// ── USER MANAGEMENT MODAL ─────────────────────────────────
function UserManagementModal({ open, onClose, tenant, toast }) {
  const [users, setUsers]     = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [editUser, setEdit]   = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [form, setForm]       = useState({ first_name:'', last_name:'', email:'', phone:'', password:'' })
  const [saving, setSaving]   = useState(false)

  const loadUsers = useCallback(() => {
    if (!tenant) return
    setLoading(true)
    getTenantUsers(tenant.id)
      .then(r => setUsers(r.data.users || []))
      .catch(() => toast({ title: 'Failed to load users', variant: 'destructive' }))
      .finally(() => setLoading(false))
  }, [tenant])

  useEffect(() => { if (open) loadUsers() }, [open, loadUsers])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const openEdit = (u) => {
    setEdit(u)
    setForm({ first_name: u.first_name, last_name: u.last_name, email: u.email, phone: u.phone || '', password: '' })
    setShowAdd(true)
  }

  const openAdd = () => {
    setEdit(null)
    setForm({ first_name:'', last_name:'', email:'', phone:'', password:'' })
    setShowAdd(true)
  }

  const submitUser = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...form }
      if (!payload.password) delete payload.password
      if (editUser) {
        await updateTenantUser(tenant.id, editUser.id, payload)
        toast({ title: 'User updated!' })
      } else {
        await createTenantUser(tenant.id, payload)
        toast({ title: 'User created!' })
      }
      setShowAdd(false)
      loadUsers()
    } catch (err) {
      toast({ title: 'Failed', description: err.response?.data?.message, variant: 'destructive' })
    } finally { setSaving(false) }
  }

  const doDelete = async () => {
    try {
      await deleteTenantUser(tenant.id, confirm.id)
      toast({ title: 'User deleted' })
      setConfirm(null)
      loadUsers()
    } catch { toast({ title: 'Failed', variant: 'destructive' }) }
  }

  if (!tenant) return null

  return (
    <Modal open={open} onClose={onClose} title={`👥 Users — ${tenant.name}`} size="xl">
      {showAdd ? (
        <form onSubmit={submitUser} className="space-y-4">
          <h3 className="font-semibold text-base mb-4">{editUser ? 'Edit User' : 'Add New User'}</h3>
          <div className="grid grid-cols-2 gap-3">
            <Input label="First Name" value={form.first_name} onChange={set('first_name')} required />
            <Input label="Last Name"  value={form.last_name}  onChange={set('last_name')}  />
          </div>
          <Input label="Email" type="email" value={form.email} onChange={set('email')} required />
          <Input label="Phone" value={form.phone} onChange={set('phone')} />
          <Input label={editUser ? 'New Password (leave blank to keep)' : 'Password'}
            type="password" value={form.password} onChange={set('password')}
            required={!editUser} minLength={8} />
          <div className="flex gap-3 justify-end pt-2 border-t border-border">
            <Button variant="ghost" type="button" onClick={() => setShowAdd(false)}>Back</Button>
            <Button type="submit" loading={saving}>{editUser ? 'Update User' : 'Add User'}</Button>
          </div>
        </form>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-muted">{users.length} user{users.length !== 1 ? 's' : ''} in this tenant</p>
            <Button size="sm" onClick={openAdd}><Plus className="w-3.5 h-3.5" /> Add User</Button>
          </div>

          {loading ? (
            <div className="space-y-2">{Array(3).fill(0).map((_,i) => <Skeleton key={i} className="h-14" />)}</div>
          ) : users.length === 0 ? (
            <EmptyState icon="👤" title="No users yet" desc="Add the first user for this tenant" />
          ) : (
            <div className="border border-border rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface2 border-b border-border">
                    {['Name', 'Email', 'Phone', 'Role', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-muted uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-b border-border/50 hover:bg-surface2/40 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-accent/20 text-accent flex items-center justify-center text-xs font-bold font-display">
                            {u.first_name?.charAt(0)}
                          </div>
                          <span className="text-sm font-semibold">{u.first_name} {u.last_name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted">{u.email}</td>
                      <td className="px-4 py-3 text-sm text-muted">{u.phone || '—'}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs bg-surface2 text-muted px-2 py-0.5 rounded-full font-mono">
                          {u.role || 'user'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => openEdit(u)}>Edit</Button>
                          <Button size="sm" variant="danger" onClick={() => setConfirm(u)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-end mt-4 pt-4 border-t border-border">
            <Button variant="ghost" onClick={onClose}>Close</Button>
          </div>
        </>
      )}

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={doDelete}
        title="Delete User"
        message={`Delete ${confirm?.first_name} ${confirm?.last_name}? This cannot be undone.`}
      />
    </Modal>
  )
}

// ── MAIN TENANTS PAGE ─────────────────────────────────────
export default function TenantsPage() {
  const [tenants, setTenants]   = useState([])
  const [plans,   setPlans]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [search,  setSearch]    = useState('')
  const [filter,  setFilter]    = useState('all')
  const [showAdd, setShowAdd]   = useState(false)
  const [detail,  setDetail]    = useState(null)
  const [users,   setUsers]     = useState(null)
  const [confirm, setConfirm]   = useState(null)
  const { toasts, toast, dismiss } = useToast()

  const load = useCallback(() => {
    setLoading(true)
    Promise.all([getTenants(), getPlans()])
      .then(([td, pd]) => {
        setTenants(td.data.tenants || [])
        setPlans(pd.data.plans || [])
      })
      .catch(() => toast({ title: 'Failed to load', variant: 'destructive' }))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = tenants.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
                        t.email.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || t.status === filter
    return matchSearch && matchFilter
  })

  const doSuspend = async (t) => {
    try {
      await suspendTenant(t.id)
      toast({ title: `${t.name} suspended` })
      load()
    } catch { toast({ title: 'Failed', variant: 'destructive' }) }
    setConfirm(null)
  }

  const doActivate = async (t) => {
    try {
      await activateTenant(t.id)
      toast({ title: `${t.name} activated` })
      load()
    } catch { toast({ title: 'Failed', variant: 'destructive' }) }
    setConfirm(null)
  }

  const doDelete = async (t) => {
    try {
      await deleteTenant(t.id)
      toast({ title: `${t.name} deleted permanently` })
      load()
    } catch { toast({ title: 'Failed', variant: 'destructive' }) }
    setConfirm(null)
  }

  const filters = ['all', 'active', 'trial', 'suspended', 'cancelled']

  return (
    <div className="animate-fadeIn">
      {/* HEADER */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="font-display font-extrabold text-3xl tracking-tight">Tenants</h1>
          <p className="text-muted text-sm mt-1">{tenants.length} businesses on your platform</p>
        </div>
        <div className="flex gap-3">
          <button onClick={load} className="p-2.5 rounded-lg bg-surface2 border border-border text-muted hover:text-white transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
          <Button onClick={() => setShowAdd(true)}>
            <Plus className="w-4 h-4" /> Add Tenant
          </Button>
        </div>
      </div>

      {/* FILTERS + SEARCH */}
      <div className="flex items-center gap-4 mb-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            className="input-base pl-9 w-56"
            placeholder="Search tenants..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1.5">
          {filters.map(f => (
            <button key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all',
                filter === f
                  ? 'bg-accent text-white'
                  : 'bg-surface2 text-muted hover:text-white border border-border'
              )}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <Card>
        {loading ? (
          <div className="p-5 space-y-3">{Array(5).fill(0).map((_,i) => <Skeleton key={i} className="h-14" />)}</div>
        ) : filtered.length === 0 ? (
          <EmptyState icon="🏢" title="No tenants found" desc="Try adjusting your search or filters" />
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {['Business', 'Plan', 'Status', 'Trial Ends', 'Database', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-[11px] font-bold text-muted uppercase tracking-wider bg-surface2">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id} className="border-b border-border/50 hover:bg-surface2/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-accent/15 text-accent flex items-center justify-center font-display font-bold text-sm shrink-0">
                        {t.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{t.name}</p>
                        <p className="text-xs text-muted">{t.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs bg-accent/15 text-accent px-2.5 py-0.5 rounded-full font-semibold">
                      {t.plan?.name || '—'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <Badge status={t.status}>{t.status}</Badge>
                  </td>
                  <td className="px-5 py-4 text-sm text-muted">{formatDate(t.trial_ends_at)}</td>
                  <td className="px-5 py-4">
                    <code className="text-[11px] bg-surface2 text-muted px-2 py-0.5 rounded font-mono">{t.db_name}</code>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => setDetail(t)}>
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setUsers(t)}>
                        <Users className="w-3.5 h-3.5" /> Users
                      </Button>
                      {t.status !== 'suspended' ? (
                        <Button size="sm" variant="danger" onClick={() => setConfirm({ action:'suspend', tenant:t })}>
                          <ShieldOff className="w-3.5 h-3.5" />
                        </Button>
                      ) : (
                        <Button size="sm" variant="success" onClick={() => setConfirm({ action:'activate', tenant:t })}>
                          <ShieldCheck className="w-3.5 h-3.5" />
                        </Button>
                      )}
                      <Button size="sm" variant="danger" onClick={() => setConfirm({ action:'delete', tenant:t })}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {/* MODALS */}
      <AddTenantModal open={showAdd} onClose={() => setShowAdd(false)}
        plans={plans} toast={toast}
        onSuccess={() => { setShowAdd(false); load() }} />

      <TenantDetailModal open={!!detail} onClose={() => setDetail(null)} tenant={detail} />

      <UserManagementModal open={!!users} onClose={() => setUsers(null)} tenant={users} toast={toast} />

      {/* CONFIRM */}
      {confirm && (
        <ConfirmDialog
          open={!!confirm}
          onClose={() => setConfirm(null)}
          onConfirm={() => {
            if (confirm.action === 'suspend')  doSuspend(confirm.tenant)
            if (confirm.action === 'activate') doActivate(confirm.tenant)
            if (confirm.action === 'delete')   doDelete(confirm.tenant)
          }}
          title={
            confirm.action === 'delete'   ? 'Delete Tenant' :
            confirm.action === 'suspend'  ? 'Suspend Tenant' : 'Activate Tenant'
          }
          message={
            confirm.action === 'delete'
              ? `Permanently delete "${confirm.tenant.name}" and their entire database? This CANNOT be undone.`
              : confirm.action === 'suspend'
              ? `Suspend "${confirm.tenant.name}"? They will lose access immediately.`
              : `Activate "${confirm.tenant.name}"? They will regain full access.`
          }
          variant={confirm.action === 'activate' ? 'success' : 'danger'}
        />
      )}

      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </div>
  )
}
