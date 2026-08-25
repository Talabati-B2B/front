export default function Select({
  label,
  options = [],
  placeholder = " ...اختر ",
  required,
  icon,
  error,
  registration = {},
}) {
  return (
    <div className="relative flex flex-col gap-1.5" dir="rtl">
      {label && (
        <label className="text-xs text-gray-500 font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        {...registration}
        className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm text-right text-gray-400 focus:outline-none focus:border-orange-400 transition bg-white appearance-none
          ${error ? "border-red-500" : "border-gray-200"}`}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value ?? o} value={o.value ?? o}>
            {o.label ?? o}
          </option>
        ))}
      </select>
      {icon && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 text-base pointer-events-none">
          {icon}
        </span>
      )}
      {error && (
        <span className="text-xs text-red-500 text-right mt-1">{error}</span>
      )}
    </div>
  );
}
