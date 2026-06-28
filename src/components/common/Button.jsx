export default function Button ({
    onClick,
    children,
    type = "button",
    disabled = false,
    className = "",
    fullWidth = false,
    variant = "primary"
}) {
    const base = `py-3 px-6 rounded-xl text-sm font-semibold transition active:scale-95 duration-200 flex items-center justify-center gap-2 ${fullWidth ? "w-full" : ""} ${className}`

    const variants = {
        primary: "bg-[#f97316] text-white hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed",
        outline: "border border-gray-300 text-gray-600 bg-white hover:bg-gray-50 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed",
        dark: "bg-[#1a3a5c] text-white hover:bg-[#16314b] disabled:bg-gray-400 disabled:cursor-not-allowed",
    }

    return (
        <button
            type={type}
            disabled={disabled}
            className={`${base} ${variants[variant]}`}
            onClick={onClick}
        >
            {children}
        </button>
    )
}