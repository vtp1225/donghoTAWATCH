import { useRef, useState } from 'react'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price_asc', label: 'Giá tăng dần' },
  { value: 'price_desc', label: 'Giá giảm dần' },
]

export default function ProductSortBar({ count = 0, label = '', sort = 'newest', onSortChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const current = SORT_OPTIONS.find((o) => o.value === sort) ?? SORT_OPTIONS[0]

  const select = (value) => {
    onSortChange?.(value)
    setOpen(false)
  }

  return (
    <div className="mb-12 flex items-center justify-between border-b border-outline-variant/10 pb-6">
      <span className="font-body-md text-sm text-on-surface-variant">
        {count} sản phẩm{label ? ` · ${label}` : ''}
      </span>

      <div className="relative" ref={ref}>
        <button
          type="button"
          className="flex items-center gap-2 font-label-caps text-[10px] tracking-[0.18em] uppercase text-on-surface/70 transition-colors hover:text-primary"
          onClick={() => setOpen((p) => !p)}
        >
          <span>Sắp xếp: {current.label}</span>
          <span className={`material-symbols-outlined text-[15px] text-primary transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
            expand_more
          </span>
        </button>

        {open && (
          <div className="absolute right-0 top-full z-30 mt-2 w-40 overflow-hidden border border-outline-variant/20 bg-surface-container shadow-xl">
            <div className="h-px bg-gradient-to-r from-primary/50 to-primary/10" />
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => select(opt.value)}
                className={`flex w-full items-center gap-2 px-4 py-3 text-left font-label-caps text-[10px] tracking-[0.15em] uppercase transition-all duration-150 hover:bg-surface-container-high hover:text-primary ${
                  opt.value === sort ? 'text-primary' : 'text-on-surface/60'
                }`}
              >
                {opt.value === sort && <span className="h-1 w-1 flex-shrink-0 bg-primary" />}
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
