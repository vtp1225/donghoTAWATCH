import { useState, useEffect, useCallback } from 'react'
import { brandService } from '../../services/brandService'

export default function BrandTable({ refreshKey, onDelete, onEdit }) {
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const list = await brandService.getAll()
      setBrands(list)
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách thương hiệu.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true

    async function fetchBrands() {
      setLoading(true)
      setError('')
      try {
        const list = await brandService.getAll()
        if (!active) return
        setBrands(list)
      } catch (err) {
        if (!active) return
        setError(err.message || 'Không thể tải danh sách thương hiệu.')
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    fetchBrands()

    return () => {
      active = false
    }
  }, [refreshKey])

  return (
    <section className="section-container relative">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-headline-sm text-headline-sm text-on-background">Danh sách Thương Hiệu</h3>
        <button onClick={load} className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors" title="Làm mới">refresh</button>
      </div>

      {loading && (
        <div className="py-12 text-center font-label-caps text-xs text-on-surface-variant/40 tracking-widest">ĐANG TẢI...</div>
      )}

      {!loading && error && (
        <div className="py-8 text-center font-label-caps text-xs text-error tracking-widest">{error}</div>
      )}

      {!loading && !error && (
        <div className="w-full overflow-hidden border border-outline-variant/10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/10">
                {['Tên', 'Trạng thái', 'Hành động'].map((h, i) => (
                    <th key={i} className="px-6 py-4 font-label-caps text-[10px] tracking-widest text-on-surface-variant/75 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {brands.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-12 text-center font-label-caps text-xs text-on-surface-variant/40 tracking-widest">KHÔNG CÓ THƯƠNG HIỆU</td></tr>
              )}
              {brands.map((b) => (
                <tr key={b.id} className="group hover:bg-surface-container-high transition-all duration-300">
                  <td className="px-6 py-5">
                    <div>
                      <p className="font-headline-sm text-sm text-on-background">{b.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5"><span className={`font-label-caps text-xs tracking-widest ${b.isActive ? 'text-primary' : 'text-on-surface-variant/60'}`}>{b.isActive ? 'Hoạt động' : 'Không hoạt động'}</span></td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => onEdit?.(b)} className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors" title="Cập nhật">edit</button>
                      <button onClick={() => onDelete?.(b)} className="material-symbols-outlined text-on-surface-variant hover:text-error transition-colors" title="Xoá">delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
