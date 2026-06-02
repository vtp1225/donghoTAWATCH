import { useState, useEffect } from 'react'
import { brandService } from '../../services/brandService'

const DEFAULTS = { name: '', slug: '', description: '', logoUrl: '', isActive: true }

function buildForm(brand) {
  if (!brand) return DEFAULTS

  return {
    name: brand.name ?? '',
    slug: brand.slug ?? '',
    description: brand.description ?? '',
    logoUrl: brand.logoUrl ?? '',
    isActive: brand.isActive ?? true,
  }
}

export default function AddBrandModal({ open, onClose, onSuccess, brand }) {
  const [form, setForm] = useState(DEFAULTS)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const isEditMode = Boolean(brand)

  useEffect(() => {
    if (open) {
      setForm(buildForm(brand))
      setError('')
    }
  }, [open, brand])

  function setField(k, v) { setForm((p) => ({ ...p, [k]: v })) }

  function validate() {
    if (!form.name.trim()) return 'Tên thương hiệu không được để trống'
    return ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }
    setSubmitting(true)
    try {
      const payload = {
        name: form.name,
        slug: form.slug || undefined,
        description: form.description || undefined,
        logoUrl: form.logoUrl || undefined,
        isActive: !!form.isActive,
      }

      if (isEditMode) {
        await brandService.update(brand.id, payload)
      } else {
        await brandService.create(payload)
      }

      onSuccess?.()
      onClose()
    } catch (err) {
      setError(err.message || (isEditMode ? 'Không thể cập nhật thương hiệu' : 'Không thể tạo thương hiệu'))
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-lg h-full bg-surface-container-low border-l border-outline-variant/20 flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-10 py-8 border-b border-outline-variant/10">
          <div>
            <span className="font-label-caps text-[10px] text-primary tracking-[0.4em] block mb-1 uppercase">Brand Console</span>
            <h2 className="font-headline-sm text-headline-sm text-on-background">{isEditMode ? 'Cập Nhật Thương Hiệu' : 'Thêm Thương Hiệu'}</h2>
          </div>
          <button onClick={onClose} className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">close</button>
        </div>

        {error && (
          <div className="mx-10 mt-4 px-4 py-3 border border-error/30 bg-error/10 font-label-caps text-[10px] text-error tracking-widest">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-10 py-8">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-label-caps text-[10px] tracking-widest text-on-surface-variant uppercase">Tên thương hiệu</label>
              <input className="bg-transparent border-b border-outline-variant/30 py-2" value={form.name} onChange={(e) => setField('name', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-label-caps text-[10px] tracking-widest text-on-surface-variant uppercase">Slug</label>
              <input className="bg-transparent border-b border-outline-variant/30 py-2" value={form.slug} onChange={(e) => setField('slug', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-label-caps text-[10px] tracking-widest text-on-surface-variant uppercase">Logo URL</label>
              <input className="bg-transparent border-b border-outline-variant/30 py-2" value={form.logoUrl} onChange={(e) => setField('logoUrl', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-label-caps text-[10px] tracking-widest text-on-surface-variant uppercase">Mô tả</label>
              <textarea className="bg-transparent border-b border-outline-variant/30 py-2 resize-none h-24" value={form.description} onChange={(e) => setField('description', e.target.value)} />
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setField('isActive', !form.isActive)} className={`w-10 h-5 relative transition-colors ${form.isActive ? 'bg-primary' : 'bg-outline-variant/30'}`}><span className={`absolute top-0.5 w-4 h-4 bg-background transition-all ${form.isActive ? 'left-5' : 'left-0.5'}`} /></button>
              <span className="font-label-caps text-[10px] text-on-surface-variant tracking-widest">Hoạt động</span>
            </div>
          </div>
        </form>

        <div className="px-10 py-6 border-t border-outline-variant/10 flex justify-end items-center">
          <button onClick={onClose} className="mr-4 font-label-caps text-xs text-on-surface-variant hover:text-primary tracking-widest">HUỶ</button>
          <button onClick={handleSubmit} disabled={submitting} className="px-6 py-3 bg-primary text-background font-label-caps text-xs tracking-[0.2em] uppercase hover:bg-primary-container transition-all disabled:opacity-50">{submitting ? 'ĐANG LƯU...' : isEditMode ? 'CẬP NHẬT' : 'TẠO'}</button>
        </div>
      </div>
    </div>
  )
}
