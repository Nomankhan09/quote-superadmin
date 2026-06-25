import { useState, useEffect, useCallback } from 'react'
import { getPlans, createPlan, updatePlan, deletePlan } from '@/services/api'
import { Button, Card, CardBody, Modal, ConfirmDialog, EmptyState, Skeleton, Input } from '@/components/ui'
import { useToast } from '@/hooks/useToast'
import { ToastContainer } from '@/components/ui'
import { Plus, Pencil, Trash2, Check } from 'lucide-react'

function PlanModal({ open, onClose, plan, onSuccess, toast }) {
  const [form, setForm] = useState({
    name: '', price: '', max_users: -1, max_quotations: -1, is_active: true, duration_days: '',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (plan) setForm({
      name: plan.name, price: plan.price, max_users: plan.max_users,
      duration_days: plan.duration_days || '', max_quotations: plan.max_quotations,
      is_active: plan.is_active
    })
    else setForm({
      name: '', price: '', max_users: -1, max_quotations: -1, duration_days: '',
      is_active: true
    })
  }, [plan, open])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (plan) await updatePlan(plan.id, form)
      else await createPlan(form)
      toast({ title: plan ? 'Plan updated!' : 'Plan created!' })
      onSuccess()
    } catch (err) {
      toast({ title: 'Failed', description: err.response?.data?.message, variant: 'destructive' })
    } finally { setLoading(false) }
  }

  return (
    <Modal open={open} onClose={onClose} title={plan ? '✏️ Edit Plan' : '➕ New Plan'}>
      <form onSubmit={submit} className="space-y-4">
        <Input label="Plan Name" placeholder="e.g. Pro, Enterprise"
          value={form.name} onChange={set('name')} required />
        <Input label="Price (₹/month)" type="number" placeholder="2499"
          value={form.price} onChange={set('price')} required />
        <Input
          label="Plan Duration (Days)"
          type="number"
          placeholder="30"
          value={form.duration_days}
          onChange={set('duration_days')}
          required
        />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Max Users (-1 = unlimited)" type="number"
            value={form.max_users} onChange={set('max_users')} />
          <Input label="Max Quotations (-1 = unlimited)" type="number"
            value={form.max_quotations} onChange={set('max_quotations')} />
        </div>
        <div className="flex gap-3 justify-end pt-2 border-t border-border">
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading}>Save Plan</Button>
        </div>
      </form>
    </Modal>
  )
}

export default function PlansPage() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [edit, setEdit] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const { toasts, toast, dismiss } = useToast()

  const load = useCallback(() => {
    setLoading(true)
    getPlans()
      .then(r => setPlans(r.data.plans || []))
      .catch(() => toast({ title: 'Failed to load plans', variant: 'destructive' }))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const doDelete = async () => {
    try {
      await deletePlan(confirm.id)
      toast({ title: 'Plan deleted' })
      load()
    } catch { toast({ title: 'Failed', variant: 'destructive' }) }
    setConfirm(null)
  }

  const colors = ['from-accent/20 to-accent/5 border-accent/20', 'from-accent2/20 to-accent2/5 border-accent2/20', 'from-success/20 to-success/5 border-success/20']
  const topColors = ['bg-accent', 'bg-accent2', 'bg-success']

  const features = (p) => [
    `${p.max_users === -1 ? 'Unlimited' : p.max_users} Users`,
    `${p.max_quotations === -1 ? 'Unlimited' : p.max_quotations} Quotations`,
    `${p.duration_days || 0} Days Validity`,
    'Mobile App Access',
    'PDF Export',
  ]

  return (
    <div className="animate-fadeIn">
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className=" font-extrabold text-4xl tracking-tight">Plans</h1>
          <p className="text-muted text-sm mt-1">Manage subscription tiers for your tenants</p>
        </div>
        <Button onClick={() => setShowAdd(true)}>
          <Plus className="w-4 h-4" /> New Plan
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-3 gap-5">
          {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-64" />)}
        </div>
      ) : plans.length === 0 ? (
        <Card><CardBody><EmptyState icon="📦" title="No plans yet" desc="Create your first pricing plan" /></CardBody></Card>
      ) : (
        <div className="grid grid-cols-3 gap-5">
          {plans.map((p, i) => (
            <div key={p.id} className={`relative rounded-xl border bg-gradient-to-br p-6 ${colors[i % colors.length]}`}>
              <div className={`absolute top-0 left-0 right-0 h-0.5 rounded-t-xl ${topColors[i % topColors.length]}`} />

              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className=" font-extrabold text-2xl">{p.name}</h3>
                  <p className="text-xs text-muted mt-0.5">per month</p>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => { setEdit(p); setShowAdd(true) }}
                    className="p-1.5 rounded-lg bg-slate-100/80 text-muted hover:text-muted transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setConfirm(p)}
                    className="p-1.5 rounded-lg bg-danger/10 text-danger hover:bg-danger/20 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className=" font-extrabold text-5xl tracking-tight mb-5">
                ₹{Number(p.price).toLocaleString()}
                <span className="text-sm font-normal text-muted">/mo</span>
              </div>

              <div className="space-y-2.5">
                {features(p).map(f => (
                  <div key={f} className="flex items-center gap-2.5 text-sm">
                    <div className="w-4 h-4 rounded-full bg-success/20 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-success" />
                    </div>
                    <span className="text-gray-600">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <PlanModal open={showAdd} onClose={() => { setShowAdd(false); setEdit(null) }}
        plan={edit} toast={toast}
        onSuccess={() => { setShowAdd(false); setEdit(null); load() }} />

      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)}
        onConfirm={doDelete} title="Delete Plan"
        message={`Delete the "${confirm?.name}" plan? Existing tenants won't be affected.`} />

      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </div>
  )
}
