export default function AuthFormField({ label, type, name, placeholder, autoComplete, value, onChange, required = false }) {
  return (
    <div className="group relative">
      <label className="mb-2 flex items-center gap-1 font-label-caps text-label-caps text-on-surface-variant transition-colors group-focus-within:text-primary" htmlFor={name}>
        {label}
        {required && <span className="text-primary">*</span>}
      </label>
      <input
        id={name}
        className="w-full border-x-0 border-t-0 border-b border-on-surface/40 bg-transparent px-0 py-3 tracking-widest text-on-surface transition-all duration-500 placeholder:text-on-surface/30 focus:border-primary focus:ring-0"
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  )
}
