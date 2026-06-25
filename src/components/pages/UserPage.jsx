import { useState, useEffect, useCallback } from "react";
import {
    Search,
    RefreshCw,
    ShieldCheck,
    ShieldOff,
} from "lucide-react";

import {
    Card,
    Badge,
    EmptyState,
    Skeleton,
} from "@/components/ui";

import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/ui";
import { activateUser, deactivateUser, getUsers } from "../../services/api";

export default function UserPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const { toast, toasts, dismiss } = useToast();

    const load = useCallback(() => {
        setLoading(true);

        getUsers()
            .then((res) => {
                setUsers(res.data.users || []);
            })
            .catch(() => {
                toast({
                    title: "Failed to load users",
                    variant: "destructive",
                });
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const toggleStatus = async (user) => {
        const newStatus = Number(user.status) === 1 ? 0 : 1;

        // Instant UI update
        setUsers((prev) =>
            prev.map((u) =>
                u.id === user.id ? { ...u, status: newStatus } : u
            )
        );

        try {
            if (newStatus === 1) {
                await activateUser(user.id);
                toast({ title: `${user.name} activated`, });
            } else {
                await deactivateUser(user.id);
                toast({ title: `${user.name} deactivated`, });
            }
        } catch (error) {
            // rollback if API fails
            setUsers((prev) =>
                prev.map((u) =>
                    u.id === user.id ? { ...u, status: user.status } : u
                )
            );

            toast({
                title: "Operation failed",
                variant: "destructive",
            });
        }
    };

    const filtered = users.filter((user) => {
        const searchMatch =
            user.name?.toLowerCase().includes(search.toLowerCase()) ||
            user.email?.toLowerCase().includes(search.toLowerCase());

        const filterMatch =
            filter === "all" ||
            (filter === "active" && user.status === 1) ||
            (filter === "inactive" && user.status === 0);

        return searchMatch && filterMatch;
    });

    const filters = ["all", "active", "inactive"];

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">
                        Users
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        {users.length} users found
                    </p>
                </div>

                <button
                    onClick={load}
                    className="w-fit rounded-xl border border-slate-200 bg-slate-100 p-2.5 transition hover:bg-slate-200"
                >
                    <RefreshCw className="h-4 w-4" />
                </button>
            </div>

            {/* Search + Filters */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative w-full lg:w-80">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search users..."
                        className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    {filters.map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`rounded-lg px-3 py-2 text-xs font-semibold capitalize transition
                ${filter === f
                                    ? "bg-blue-500 text-white"
                                    : "border border-slate-200 bg-white text-slate-600"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <Card className="overflow-hidden rounded-2xl border border-slate-200">
                {loading ? (
                    <div className="space-y-3 p-5">
                        {Array(5)
                            .fill(0)
                            .map((_, i) => (
                                <Skeleton key={i} className="h-14" />
                            ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <EmptyState
                        icon="👤"
                        title="No users found"
                        desc="Try changing search or filter"
                    />
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden overflow-x-auto lg:block">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="px-5 py-4 text-left text-xs uppercase">
                                            User
                                        </th>
                                        <th className="px-5 py-4 text-left text-xs uppercase">
                                            Email
                                        </th>
                                        {/* <th className="px-5 py-4 text-left text-xs uppercase">
                                            Role
                                        </th> */}
                                        <th className="px-5 py-4 text-left text-xs uppercase">
                                            Status
                                        </th>
                                        <th className="px-5 py-4 text-left text-xs uppercase">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filtered.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="border-b border-slate-100 hover:bg-slate-50/80 transition-all"
                                        >
                                            <td className="px-5 py-4 font-medium">
                                                {user.name}
                                            </td>

                                            <td className="px-5 py-4 text-slate-500">
                                                {user.email}
                                            </td>

                                            {/* <td className="px-5 py-4">
                                                {user.role}
                                            </td> */}

                                            <td className="px-5 py-4">
                                                <Badge
                                                    status={
                                                        user.status === 1
                                                            ? "active"
                                                            : "suspended"
                                                    }
                                                >
                                                    {user.status === 1
                                                        ? "active"
                                                        : "suspended"}
                                                </Badge>
                                            </td>

                                            <td className="px-5 py-4">
                                                <label className="relative inline-flex cursor-pointer items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={user.status === 1}
                                                        onChange={() => toggleStatus(user)}
                                                        className="peer sr-only"
                                                    />

                                                    <div className="peer h-6 w-11 rounded-full bg-slate-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-green-500 peer-checked:after:translate-x-5" />
                                                </label>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="space-y-3 p-4 lg:hidden">
                            {filtered.map((user) => (
                                <div
                                    key={user.id}
                                    className="rounded-xl border border-slate-200 p-4"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-semibold">
                                                {user.name}
                                            </h3>

                                            <p className="text-sm text-slate-500">
                                                {user.email}
                                            </p>

                                            <p className="mt-2 text-xs text-slate-400">
                                                {user.role}
                                            </p>
                                        </div>

                                        <Badge
                                            status={
                                                user.status === 1
                                                    ? "active"
                                                    : "suspended"
                                            }
                                        >
                                            {user.status === 1
                                                ? "active"
                                                : "suspended"}
                                        </Badge>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between border-t pt-3">
                                        <span className="text-sm text-slate-500">
                                            Status
                                        </span>

                                        <label className="relative inline-flex cursor-pointer items-center">
                                            <input
                                                type="checkbox"
                                                checked={Number(user.status) === 1}
                                                onChange={() => toggleStatus(user)}
                                                className="peer sr-only"
                                            />

                                            <div className="peer h-6 w-11 rounded-full bg-slate-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-green-500 peer-checked:after:translate-x-5" />
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </Card>

            <ToastContainer
                toasts={toasts}
                dismiss={dismiss}
            />
        </div>
    );
}