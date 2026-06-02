const stats = [
  {
    label: 'Doanh thu',
    value: '$4,820,000',
    accent: 'text-primary',
    detail: (
      <div className="flex items-center gap-2 text-[10px] font-label-caps text-green-400">
        <span className="material-symbols-outlined text-xs">trending_up</span>
        +12% so với tháng trước
      </div>
    ),
    bg: '',
  },
  {
    label: 'Sản phẩm đang bán',
    value: '142 Sản phẩm',
    accent: 'text-on-background',
    detail: (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 text-[10px] font-label-caps text-primary">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" /> 82 Heritage
        </div>
        <div className="flex items-center gap-1 text-[10px] font-label-caps text-secondary">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary" /> 60 Minimalist
        </div>
      </div>
    ),
    bg: '',
  },
  {
    label: 'Cần chú ý',
    value: '4 Sản phẩm sắp hết hàng',
    accent: 'text-error',
    detail: (
      <p className="text-[10px] font-label-caps text-on-surface-variant/60 leading-relaxed">
        CRITICAL UPDATES NEEDED FOR CHRONOS SERIES G3.
      </p>
    ),
    bg: 'bg-surface-container-lowest',
  },
]

export default function StatsGrid() {
  return (
    <section className="grid grid-cols-12 gap-gutter mb-section-gap-desktop">
      {stats.map(({ label, value, accent, detail, bg }) => (
        <div
          key={label}
          className={`col-span-4 p-8 border border-outline-variant/10 hover:border-primary/40 transition-colors ${bg}`}
        >
          <p className="font-label-caps text-[10px] text-on-surface-variant tracking-widest uppercase mb-2">{label}</p>
          <h3 className={`font-headline-md text-headline-md mb-4 ${accent}`}>{value}</h3>
          {detail}
        </div>
      ))}
    </section>
  )
}
