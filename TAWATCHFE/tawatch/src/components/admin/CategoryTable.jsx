import { useState, useEffect, useCallback } from 'react'
import { categoryService } from '../../services/categoryService'

function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('')
}

export default function CategoryTable({ onDelete, onEdit, onDataChange }) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const list = await categoryService.getAll()
      setCategories(list)
      onDataChange?.(list)
    } catch (loadError) {
      setError(loadError.message || 'Không thể tải danh sách danh mục.')
    } finally {
      setLoading(false)
    }
  }, [onDataChange])

  useEffect(() => {
    let active = true

    async function fetchCategories() {
      try {
        const list = await categoryService.getAll()
        if (!active) return
        setCategories(list)
        setError('')
        onDataChange?.(list)
      } catch (loadError) {
        if (!active) return
        setError(loadError.message || 'Không thể tải danh sách danh mục.')
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    fetchCategories()

    return () => {
      active = false
    }
  }, [onDataChange])

  return (
    <section className="section-container relative">
      <div className="mb-8 border-b border-outline-variant/10 flex justify-between items-center pb-4">
        <h3 className="font-label-caps text-label-caps text-primary tracking-[0.2em]">GLOBAL TAXONOMY</h3>
        <button onClick={load} className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors" title="Làm mới">refresh</button>
      </div>

      {loading && (
        <div className="py-12 text-center font-label-caps text-xs text-on-surface-variant/40 tracking-widest">ĐANG TẢI DANH MỤC...</div>
      )}

      {!loading && error && (
        <div className="py-8 text-center font-label-caps text-xs text-error tracking-widest">{error}</div>
      )}

      {!loading && !error && (
        <div className="space-y-4">
          {categories.length === 0 && (
            <div className="border border-outline-variant/10 p-10 text-center font-label-caps text-xs text-on-surface-variant/40 tracking-widest">CHƯA CÓ DANH MỤC NÀO</div>
          )}

          {categories.map((category) => {
            const isRoot = category.parentId == null
            const childrenCount = Array.isArray(category.children) ? category.children.length : 0

            return (
              <div key={category.id} className="group border border-outline-variant/10 hover:border-primary/40 transition-all duration-500 bg-surface-container-lowest p-6 flex flex-col md:flex-row items-center gap-6">
                <div className="w-20 h-20 bg-surface-container-high border border-outline-variant/20 flex-shrink-0 flex items-center justify-center">
                  <span className="font-headline-sm text-primary text-xl tracking-wider">{initials(category.name)}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-headline-sm text-headline-sm text-on-surface truncate">{category.name}</h4>
                    <span className={`px-2 py-0.5 font-label-caps text-[10px] border ${isRoot ? 'bg-primary/10 text-primary border-primary/20' : 'bg-secondary-container/30 text-on-surface-variant border-outline-variant/30'}`}>
                      {isRoot ? 'ROOT' : 'CHILD'}
                    </span>
                  </div>
                  <p className="font-body-md text-on-surface-variant/80 line-clamp-1">Slug: {category.slug || 'chua co slug'}</p>
                  <p className="font-body-md text-on-surface-variant/60 text-sm">Danh mục cha: {category.parentName || 'Khong co'}</p>
                </div>

                <div className="flex flex-col items-center min-w-16">
                  <span className="font-label-caps text-[10px] text-on-surface-variant">CHILDREN</span>
                  <span className="font-headline-sm text-primary">{childrenCount}</span>
                </div>

                <div className="flex gap-4 border-l border-outline-variant/20 pl-6">
                  <button onClick={() => onEdit?.(category)} className="text-on-surface-variant hover:text-primary transition-colors" title="Edit">
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                  <button onClick={() => onDelete?.(category)} className="text-on-surface-variant hover:text-error transition-colors" title="Delete">
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
