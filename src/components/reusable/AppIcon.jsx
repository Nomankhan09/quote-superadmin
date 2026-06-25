import { useState } from "react"

export default function AppIcon({
    icon,
    name,
    size = "w-9 h-9",
}) {
    const [error, setError] = useState(false)

    if (!icon || error) {
        return (
            <div
                className={`
                    ${size}
                    rounded-lg
                    bg-blue-50
                    text-blue-600
                    flex
                    items-center
                    justify-center
                    font-bold
                    text-sm
                `}
            >
                {name?.charAt(0)?.toUpperCase()}
            </div>
        )
    }

    return (
        <img
            src={icon}
            alt={name}
            onError={() => setError(true)}
            className={`
                ${size}
                rounded-xl
                object-cover
                p-1
                border
                border-slate-200
                bg-white
            `}
        />
    )
}