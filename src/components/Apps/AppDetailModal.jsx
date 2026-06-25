import {
    Database,
    Globe,
    Smartphone,
    Shield,
    Calendar,
} from 'lucide-react'
import { Badge, Button, Modal } from '../ui'
import { formatDate, cn } from '@/lib/utils'
import AppIcon from '../reusable/AppIcon'

export function AppDetailModal({ open, onClose, app }) {
    if (!app) return null

    const fields = [
        {
            icon: Database,
            label: 'Code',
            val: app.code,
        },
        {
            icon: Database,
            label: 'API URL',
            val: app.api_url,
        },
        {
            icon: Globe,
            label: 'Website',
            val: app.web_url || '—',
        },
        {
            icon: Smartphone,
            label: 'Mobile App',
            val: app.has_mobile_app ? 'Yes' : 'No',
        },
        {
            icon: Shield,
            label: 'SSO',
            val: app.sso_secret ? 'Configured' : 'Not Configured',
        },
        {
            icon: Calendar,
            label: 'Created',
            val: formatDate(app.created_at),
        },
    ]

    return (
        <Modal
            open={open}
            onClose={onClose}
            size="md"
        >
            <div className="flex items-start gap-4 mb-5">

                <AppIcon
                    icon={app.app_icon || app.icon}
                    name={app.name}
                    size={`
                        w-12
                        h-12
                        rounded-2xl
                        bg-gradient-to-br
                        ${app.app_icon || app.icon ? '' : 'from-blue-500 to-violet-500'}
                        flex
                        items-center
                        justify-center
                        font-bold
                        text-xl
                        text-white
                        shrink-0
                        shadow-md
                        shadow-blue-200/40
                        `}
                />

                <div>
                    <h2
                        className="
                            font-display
                            font-bold
                            text-xl
                        "
                    >
                        {app.name}
                    </h2>

                    <Badge
                        status={
                            app.status
                                ? 'active'
                                : 'cancelled'
                        }
                    >
                        {app.status
                            ? 'Active'
                            : 'Inactive'}
                    </Badge>

                    <span
                        className="
                            ml-2
                            text-xs
                            text-accent
                            font-semibold
                        "
                    >
                        {app.code}
                    </span>
                </div>

            </div>

            <div
                className="
                    space-y-0
                    divide-y
                    divide-slate-100
                    rounded-2xl
                    border
                    border-slate-200
                    overflow-hidden
                    bg-white
                "
            >

                {fields.map(
                    ({
                        icon: Icon,
                        label,
                        val,
                    }) => (
                        <div
                            key={label}
                            className="
                                flex
                                items-center
                                gap-3
                                px-4
                                py-3
                                bg-slate-50/70
                            "
                        >

                            <Icon
                                className="
                                    w-3.5
                                    h-3.5
                                    text-slate-400
                                    shrink-0
                                "
                            />

                            <span
                                className="
                                    text-xs
                                    text-slate-500
                                    w-24
                                    shrink-0
                                    font-medium
                                "
                            >
                                {label}
                            </span>

                            <span
                                className="
                                    text-sm
                                    font-mono
                                    text-slate-900
                                    truncate
                                "
                            >
                                {val}
                            </span>

                        </div>
                    )
                )}

            </div>

            {app.description && (
                <div
                    className="
                        mt-4
                        rounded-2xl
                        border
                        border-slate-200
                        p-4
                        bg-slate-50
                    "
                >
                    <p
                        className="
                            text-xs
                            uppercase
                            tracking-wide
                            text-slate-500
                            font-bold
                            mb-2
                        "
                    >
                        Description
                    </p>

                    <p
                        className="
                            text-sm
                            text-slate-700
                        "
                    >
                        {app.description}
                    </p>
                </div>
            )}

            <div className="flex justify-end mt-5">
                <Button
                    variant="ghost"
                    onClick={onClose}
                >
                    Close
                </Button>
            </div>

        </Modal>
    )
}