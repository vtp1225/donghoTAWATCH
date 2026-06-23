function Skeleton({ className }) {
  return <div className={`animate-pulse rounded-sm bg-surface-container ${className}`} />
}

export default function StatsGrid({ stats = [], loading = false }) {
  return (
    <section className="mb-10 grid grid-cols-4 gap-4">
      {stats.map(({ label, value, icon, accent = 'text-on-background', detail, detailColor }) => (
        <div
          key={label}
          className="border border-outline-variant/10 bg-surface-container-lowest p-7 transition-colors hover:border-primary/25"
        >
          <div className="mb-5 flex items-start justify-between">
            <p className="font-label-caps text-xs tracking-[0.25em] uppercase text-on-surface-variant/55">
              {label}
            </p>
            <span className="material-symbols-outlined text-2xl text-on-surface-variant/20">{icon}</span>
          </div>

          {loading ? (
            <Skeleton className="mb-4 h-10 w-3/4" />
          ) : (
            <p className={`mb-4 font-headline-md text-4xl leading-none ${accent}`}>{value ?? '—'}</p>
          )}

          {loading ? (
            <Skeleton className="h-4 w-1/2" />
          ) : detail != null ? (
            <p className={`font-label-caps text-xs tracking-wider ${detailColor ?? 'text-on-surface-variant/45'}`}>
              {detail}
            </p>
          ) : null}
        </div>
      ))}
    </section>
  )
}
