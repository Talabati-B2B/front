import { motion } from "framer-motion";

export default function Input({
  label,
  placeholder,
  type = "text",
  icon,
  actionIcon,
  required,
  error,
  registration = {},
}) {
  return (
    <div className="flex flex-col gap-1" dir="rtl">
      {label && (
        <label className="text-sm text-gray-500 font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          {...registration}
          className={`w-full border border-gray-300 rounded-xl px-8 py-2.5 text-sm text-right placeholder:text-gray-400 focus:outline-none focus:border-orange-400 transition ${error ? "border-red-500" : "border-gray-300"}`}
        />
        {icon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
            {icon}
          </span>
        )}

        {/* toggleIcons .. for passwordInputs */}
        {actionIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
            {actionIcon}
          </span>
        )}
      </div>
      {/* error message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-500 text-right"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
