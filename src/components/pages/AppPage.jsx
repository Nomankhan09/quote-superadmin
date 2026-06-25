import { useState, useEffect, useCallback } from 'react'
import {
    getApps,
    createApp,
    activateApp,
    deactivateApp,
    deleteApp,
} from '@/services/api'
import {
    Button, Badge, Card, CardHeader, CardTitle, CardBody,
    Modal, ConfirmDialog, EmptyState, Skeleton, Input, Select
} from '@/components/ui'
import { formatDate, cn } from '@/lib/utils'
import {
    Plus, Search, Eye, UserCog, Trash2,
    ShieldOff, ShieldCheck, X, Users, Mail,
    Phone, Database, Calendar, RefreshCw, Pencil
} from 'lucide-react'
import { useToast } from '@/hooks/useToast'
import { ToastContainer } from '@/components/ui'
import { AddAppModal } from '../Apps/AddAppModal'
import { AppDetailModal } from '../Apps/AppDetailModal'
import AppIcon from '../reusable/AppIcon'

// ── MAIN TENANTS PAGE ─────────────────────────────────────
export default function AppPage() {
    const [apps, setApps] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('all')
    const [showAdd, setShowAdd] = useState(false)
    const [detail, setDetail] = useState(null)
    const [confirm, setConfirm] = useState(null)
    const [editingApp, setEditingApp] = useState(null)
    const { toasts, toast, dismiss } = useToast()

    const load = useCallback(() => {
        setLoading(true)

        getApps()
            .then((res) => {
                setApps(res.data.apps || [])
            })
            .catch(() =>
                toast({
                    title: 'Failed to load',
                    variant: 'destructive',
                })
            )
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => { load() }, [load])

    const filtered = apps.filter(app => {
        const matchSearch =
            app.name?.toLowerCase().includes(search.toLowerCase()) ||
            app.code?.toLowerCase().includes(search.toLowerCase())

        const matchFilter =
            filter === 'all' ||
            (filter === 'active' && app.status === 'active') ||
            (filter === 'inactive' && app.status !== 'active')

        return matchSearch && matchFilter
    })

    const doSuspend = async (t) => {
        try {
            await deactivateApp(t.id)
            toast({ title: `${t.name} suspended` })
            load()
        } catch { toast({ title: 'Failed', variant: 'destructive' }) }
        setConfirm(null)
    }

    const doActivate = async (t) => {
        try {
            await activateApp(t.id)
            toast({ title: `${t.name} activated` })
            load()
        } catch { toast({ title: 'Failed', variant: 'destructive' }) }
        setConfirm(null)
    }

    const doDelete = async (t) => {
        try {
            await deleteApp(t.id)
            toast({ title: `${t.name} deleted permanently` })
            load()
        } catch { toast({ title: 'Failed', variant: 'destructive' }) }
        setConfirm(null)
    }

    const filters = [
        'all',
        'active',   
        'inactive'
    ]

    return (
        <div className="animate-fadeIn space-y-6">
            {/* HEADER */}
            <div className="flex items-end justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Websites & Apps</h1>
                    <p className="text-slate-500 text-sm mt-1 font-medium">{apps.length} apps configured</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={load} className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-all">
                        <RefreshCw className="w-4 h-4" />
                    </button>
                    <Button onClick={() => setShowAdd(true)}>
                        <Plus className="w-4 h-4" /> Add App
                    </Button>
                </div>
            </div>

            {/* FILTERS + SEARCH */}
            <div className="flex items-center gap-4 mb-5">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        className="w-64 h-11 pl-10 pr-4 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                        placeholder="Search apps..."
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
                                    ? 'bg-blue-500 text-white shadow-sm shadow-blue-200/50'
                                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                            )}>
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* TABLE */}
            <Card className="overflow-hidden border border-slate-200/70 bg-white/90 backdrop-blur-xl shadow-sm rounded-2xl">
                {loading ? (
                    <div className="p-5 space-y-3">{Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-14" />)}</div>
                ) : filtered.length === 0 ? (
                    <EmptyState icon="🏢" title="No apps found" desc="Try adjusting your search or filters" />
                ) : (
                    <table className="w-full border-separate border-spacing-0">
                        <thead>
                            <tr className="border-b border-slate-200">
                                {[
                                    'App',
                                    'Code',
                                    'Status',
                                    'Mobile',
                                    'API URL',
                                    'Actions'
                                ].map(h => (
                                    <th key={h} className="px-5 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] bg-slate-50 border-b border-slate-200">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(app => (
                                <tr
                                    key={app.id}
                                    className="    border-b    border-slate-100    hover:bg-slate-50/80    transition-all"
                                >
                                    <td className="px-5 py-4">
                                        <AppIcon
                                            icon={app.app_icon || app.icon}
                                            name={app.name}
                                        />
                                    </td>

                                    <td className="px-5 py-4">
                                        <code
                                            className="    text-[11px]    bg-slate-100    text-slate-600    px-2.5    py-1    rounded-lg    font-mono"
                                        >
                                            {app.code}
                                        </code>
                                    </td>

                                    <td className="px-5 py-4">
                                        <Badge
                                            status={
                                                app.status === 'active'
                                                    ? 'active'
                                                    : 'suspended'
                                            }
                                        >
                                            {app.status === 'active'
                                                ? 'Active'
                                                : 'Inactive'}
                                        </Badge>
                                    </td>

                                    <td className="px-5 py-4">
                                        {app.has_mobile_app
                                            ? '📱 Yes'
                                            : '—'}
                                    </td>

                                    <td className="px-5 py-4">
                                        <span className="text-sm text-slate-500">
                                            {app.api_url}
                                        </span>
                                    </td>

                                    <td className="px-5 py-4">
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => {
                                                    setEditingApp(app)
                                                    setShowAdd(true)
                                                }}
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => setDetail(app)}
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                            </Button>

                                            {app.status === 'active' ? (
                                                <Button
                                                    size="sm"
                                                    variant="danger"
                                                    onClick={() =>
                                                        setConfirm({
                                                            action: 'deactivate',
                                                            app
                                                        })
                                                    }
                                                >
                                                    <ShieldOff className="w-3.5 h-3.5" />
                                                </Button>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    variant="success"
                                                    onClick={() =>
                                                        setConfirm({
                                                            action: 'activate',
                                                            app
                                                        })
                                                    }
                                                >
                                                    <ShieldCheck className="w-3.5 h-3.5" />
                                                </Button>
                                            )}

                                            {/* <Button
                                                size="sm"
                                                variant="danger"
                                                onClick={() =>
                                                    setConfirm({
                                                        action: 'delete',
                                                        app
                                                    })
                                                }
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button> */}

                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </Card>

            {/* MODALS */}
            <AddAppModal className="w-full" open={showAdd} onClose={() => setShowAdd(false)}
                app={editingApp}
                toast={toast}
                onSuccess={() => { setShowAdd(false); setEditingApp(null); load() }} />

            <AppDetailModal open={!!detail} onClose={() => setDetail(null)} app={detail} />


            {/* CONFIRM */}
            {confirm && (
                <ConfirmDialog
                    open={!!confirm}
                    onClose={() => setConfirm(null)}
                    onConfirm={() => {
                        if (confirm.action === 'deactivate') doSuspend(confirm.app)
                        if (confirm.action === 'activate') doActivate(confirm.app)
                        if (confirm.action === 'delete') doDelete(confirm.app)
                    }}
                    title={
                        confirm.action === 'delete'
                            ? 'Delete App'
                            : confirm.action === 'deactivate'
                                ? 'Deactivate App'
                                : 'Activate App'
                    }
                    message={
                        confirm.action === 'delete'
                            ? `Delete "${confirm.app.name}" permanently?`
                            : confirm.action === 'deactivate'
                                ? `Deactivate "${confirm.app.name}"?`
                                : `Activate "${confirm.app.name}"?`
                    }
                    variant={confirm.action === 'activate' ? 'success' : 'danger'}
                />
            )}

            <ToastContainer toasts={toasts} dismiss={dismiss} />
        </div>
    )
}
