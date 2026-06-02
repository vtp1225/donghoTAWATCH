export default function AuthSocialButton({ children, icon, onClick }) {
  return (
    <button
      className="flex w-full items-center justify-center gap-3 border border-outline-variant/30 bg-transparent py-4 font-label-caps text-label-caps text-on-surface transition-all duration-500 hover:bg-surface-container-high/50"
      type="button"
      onClick={onClick}
    >
      {icon}
      <span>{children}</span>
    </button>
  )
}
