import { useEffect, useState, useCallback } from "react";
import { Card, Badge, Skeleton, EmptyState } from "@/components/ui";
import { RefreshCw } from "lucide-react";
import { getAccessRequests } from "@/services/api";

export default function AccessRequestsPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(() => {
        setLoading(true);

        getAccessRequests()
            .then((res) => {
                setData(res.data.data || []);
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black">Access Requests</h1>
                    <p className="text-sm text-slate-500">
                        Get access requests from users
                    </p>
                </div>

                <button
                    onClick={load}
                    className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-all"
                >
                    <RefreshCw className="h-4 w-4" />
                </button>
            </div>

            <Card className="rounded-2xl border overflow-hidden">
                {loading ? (
                    <div className="p-5 space-y-3">
                        {Array(5).fill(0).map((_, i) => (
                            <Skeleton key={i} className="h-14" />
                        ))}
                    </div>
                ) : data.length === 0 ? (
                    <EmptyState
                        icon="🔐"
                        title="No access requests"
                        desc="Users have not requested access yet"
                    />
                ) : (
                    <>
                        {/* ── Desktop table (md+) ── */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b">
                                    <tr className="border-b border-slate-200">
                                        <th className="text-left p-4 text-sm font-semibold text-slate-600">User</th>
                                        <th className="text-left p-4 text-sm font-semibold text-slate-600">Email</th>
                                        <th className="text-left p-4 text-sm font-semibold text-slate-600">App</th>
                                        <th className="text-left p-4 text-sm font-semibold text-slate-600">Message</th>
                                        <th className="text-left p-4 text-sm font-semibold text-slate-600">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="border-b border-slate-100 hover:bg-slate-50/80 transition-all"
                                        >
                                            <td className="p-4 font-medium">
                                                {item.user?.first_name || "Guest"}
                                            </td>
                                            <td className="p-4 text-slate-500">
                                                {item.meta?.email || item.user?.email}
                                            </td>
                                            <td className="p-4">
                                                {item.app?.name ? (
                                                    <Badge>{item.app.name}</Badge>
                                                ) : (
                                                    <span className="text-slate-400">—</span>
                                                )}
                                            </td>
                                            <td className="p-4 text-sm text-slate-600">
                                                {item.meta?.message || "—"}
                                            </td>
                                            <td className="p-4 text-sm text-slate-500">
                                                {new Date(item.created_at).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* ── Mobile card list (< md) ── */}
                        <div className="md:hidden divide-y divide-slate-100">
                            {data.map((item) => (
                                <div
                                    key={item.id}
                                    className="p-4 space-y-3 hover:bg-slate-50/80 transition-all"
                                >
                                    {/* Row 1: name + app badge */}
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="font-semibold text-slate-900">
                                            {item.user?.first_name || "Guest"}
                                        </span>
                                        {item.app?.name ? (
                                            <Badge>{item.app.name}</Badge>
                                        ) : null}
                                    </div>

                                    {/* Row 2: email */}
                                    <div className="text-sm text-slate-500 truncate">
                                        {item.meta?.email || item.user?.email}
                                    </div>

                                    {/* Row 3: message (only if present) */}
                                    {item.meta?.message && (
                                        <p className="text-sm text-slate-600 leading-relaxed">
                                            {item.meta.message}
                                        </p>
                                    )}

                                    {/* Row 4: date, right-aligned */}
                                    <div className="text-xs text-slate-400 text-right">
                                        {new Date(item.created_at).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
}