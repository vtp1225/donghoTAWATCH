import { useState } from 'react'
import { brandService } from '../../services/brandService.js'
import useCategoryTree from '../../hooks/useCategoryTree.js'
import { useEffect } from 'react'

const MOVEMENTS = ['AUTOMATIC', 'MANUAL', 'QUARTZ']
const MOVEMENT_LABELS = { AUTOMATIC: 'Automatic', MANUAL: 'Manual', QUARTZ: 'Quartz' }
const MAX_PRICE = 500_000_000

function formatVnd(value) {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(0)} tỷ`
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)} triệu`
  return new Intl.NumberFormat('vi-VN').format(value)
}

function collectIds(node) {
  const childIds = Array.isArray(node?.children) ? node.children.flatMap(collectIds) : []
  return [node.id, ...childIds]
}

function SectionHeader({ title }) {
  return (
    <h3 className="mb-5 border-b border-outline-variant/20 pb-2 font-label-caps text-[10px] tracking-[0.25em] text-primary uppercase">
      {title}
    </h3>
  )
}

function CheckRow({ label, checked, onChange, children }) {
  return (
    <li>
      <button
        type="button"
        className={`flex w-full items-center gap-3 text-left font-body-md text-sm transition-colors duration-200 hover:text-primary ${checked ? 'text-primary' : 'text-on-surface-variant'}`}
        onClick={onChange}
      >
        <span className={`h-2 w-2 flex-shrink-0 transition-colors duration-200 ${checked ? 'bg-primary' : 'border border-outline-variant/50'}`} />
        <span className="flex-1">{label}</span>
      </button>
      {children}
    </li>
  )
}

function CategoryNode({ category, selectedIds, onToggle, depth = 0 }) {
  const [open, setOpen] = useState(false)
  const children = Array.isArray(category.children) ? category.children : []
  const hasChildren = children.length > 0
  const allDescendants = collectIds(category)
  const checked = allDescendants.some((id) => selectedIds.includes(id))
  const partiallyChecked = checked && !allDescendants.every((id) => selectedIds.includes(id))

  return (
    <li>
      <div className={`flex items-center gap-2 ${depth > 0 ? 'pl-4' : ''}`}>
        <button
          type="button"
          className={`flex flex-1 items-center gap-3 py-0.5 text-left font-body-md text-sm transition-colors duration-200 hover:text-primary ${checked ? 'text-primary' : 'text-on-surface-variant'}`}
          onClick={() => onToggle(category)}
        >
          <span className={`h-2 w-2 flex-shrink-0 transition-colors duration-200 ${
            checked
              ? partiallyChecked
                ? 'border-2 border-primary'
                : 'bg-primary'
              : 'border border-outline-variant/50'
          }`} />
          <span className="flex-1">{category.name}</span>
        </button>
        {hasChildren && (
          <button
            type="button"
            className="p-0.5 text-on-surface-variant/40 transition-colors hover:text-primary"
            onClick={() => setOpen((p) => !p)}
            aria-label={open ? 'Thu gọn' : 'Mở rộng'}
          >
            <span className={`material-symbols-outlined text-[14px] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
              expand_more
            </span>
          </button>
        )}
      </div>
      {hasChildren && open && (
        <ul className="mt-1 space-y-1.5 border-l border-outline-variant/15 ml-1">
          {children.map((child) => (
            <CategoryNode
              key={child.id}
              category={child}
              selectedIds={selectedIds}
              onToggle={onToggle}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

export default function ProductFiltersSidebar({ filters, onChange }) {
  const [brands, setBrands] = useState([])
  const { categories, loading: catLoading } = useCategoryTree()

  useEffect(() => {
    brandService.getAll().then((data) => setBrands(Array.isArray(data) ? data : [])).catch(() => {})
  }, [])

  const toggleBrand = (id) => {
    const next = filters.brandIds.includes(id)
      ? filters.brandIds.filter((b) => b !== id)
      : [...filters.brandIds, id]
    onChange({ ...filters, brandIds: next })
  }

  const toggleMovement = (type) => {
    const next = filters.movementTypes.includes(type)
      ? filters.movementTypes.filter((m) => m !== type)
      : [...filters.movementTypes, type]
    onChange({ ...filters, movementTypes: next })
  }

  const toggleCategory = (category) => {
    const ids = collectIds(category)
    const allSelected = ids.every((id) => filters.categoryIds.includes(id))
    const next = allSelected
      ? filters.categoryIds.filter((id) => !ids.includes(id))
      : [...new Set([...filters.categoryIds, ...ids])]
    onChange({ ...filters, categoryIds: next })
  }

  const hasActiveFilters =
    filters.brandIds.length > 0 ||
    filters.movementTypes.length > 0 ||
    filters.categoryIds.length > 0 ||
    filters.priceMax != null

  const clearAll = () => onChange({ brandIds: [], movementTypes: [], categoryIds: [], priceMax: null })

  return (
    <aside className="space-y-9 lg:col-span-3">
      {hasActiveFilters && (
        <button
          type="button"
          className="flex items-center gap-2 font-label-caps text-[10px] tracking-[0.18em] uppercase text-on-surface-variant/60 transition-colors hover:text-primary"
          onClick={clearAll}
        >
          <span className="material-symbols-outlined text-[14px]">close</span>
          Xóa bộ lọc
        </button>
      )}

      {/* Category */}
      <div>
        <SectionHeader title="Thể loại" />
        {catLoading ? (
          <p className="font-body-md text-xs text-on-surface-variant/40">Đang tải...</p>
        ) : (
          <ul className="space-y-2.5">
            {categories.map((cat) => (
              <CategoryNode
                key={cat.id}
                category={cat}
                selectedIds={filters.categoryIds}
                onToggle={toggleCategory}
              />
            ))}
          </ul>
        )}
      </div>

      {/* Brand */}
      <div>
        <SectionHeader title="Thương hiệu" />
        {brands.length === 0 ? (
          <p className="font-body-md text-xs text-on-surface-variant/40">Đang tải...</p>
        ) : (
          <ul className="space-y-3.5">
            {brands.map((brand) => (
              <CheckRow
                key={brand.id}
                label={brand.name}
                checked={filters.brandIds.includes(brand.id)}
                onChange={() => toggleBrand(brand.id)}
              />
            ))}
          </ul>
        )}
      </div>

      {/* Movement */}
      <div>
        <SectionHeader title="Loại máy" />
        <div className="flex flex-wrap gap-2">
          {MOVEMENTS.map((type) => {
            const active = filters.movementTypes.includes(type)
            return (
              <button
                key={type}
                type="button"
                onClick={() => toggleMovement(type)}
                className={`border px-3 py-1.5 font-label-caps text-[10px] tracking-[0.15em] uppercase transition-all duration-200 ${
                  active
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-outline-variant/25 text-on-surface-variant/70 hover:border-primary/50 hover:text-primary'
                }`}
              >
                {MOVEMENT_LABELS[type]}
              </button>
            )
          })}
        </div>
      </div>

      {/* Price */}
      <div>
        <SectionHeader title="Giá tối đa" />
        <input
          className="h-0.5 w-full cursor-pointer appearance-none bg-outline-variant/20 accent-primary"
          type="range"
          min={0}
          max={MAX_PRICE}
          step={5_000_000}
          value={filters.priceMax ?? MAX_PRICE}
          onChange={(e) => {
            const val = Number(e.target.value)
            onChange({ ...filters, priceMax: val >= MAX_PRICE ? null : val })
          }}
        />
        <div className="mt-3 flex justify-between font-label-caps text-[10px] tracking-[0.12em] text-on-surface-variant/55">
          <span>₫0</span>
          <span className={filters.priceMax != null ? 'text-primary' : ''}>
            {filters.priceMax != null ? `₫${formatVnd(filters.priceMax)}` : 'Tất cả'}
          </span>
        </div>
      </div>
    </aside>
  )
}
