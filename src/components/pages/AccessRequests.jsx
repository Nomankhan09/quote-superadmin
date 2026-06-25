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
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b">
                            <tr className="border-b border-slate-200">
                                <th className="text-left p-4">User</th>
                                <th className="text-left p-4">Email</th>
                                <th className="text-left p-4">App</th>
                                <th className="text-left p-4">Message</th>
                                <th className="text-left p-4">Date</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.map((item) => (
                                <tr key={item.id}
                                    className="    border-b    border-slate-100    hover:bg-slate-50/80    transition-all"
                                >
                                    <td className="p-4 font-medium">
                                        {item.user?.first_name || "Guest"}
                                    </td>

                                    <td className="p-4 text-slate-500">
                                        {item.meta?.email || item.user?.email}
                                    </td>

                                    <td className="p-4">
                                        {item.app?.name ?
                                            <Badge>
                                                {item.app?.name || ``}
                                            </Badge> :
                                            <div className="text-slate-600">
                                                -
                                            </div>
                                        }
                                    </td>

                                    <td className="p-4 text-sm text-slate-600">
                                        {item.meta?.message || "-"}
                                    </td>

                                    <td className="p-4 text-sm text-slate-500">
                                        {new Date(item.created_at).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

            </Card>
        </div>
    );
}