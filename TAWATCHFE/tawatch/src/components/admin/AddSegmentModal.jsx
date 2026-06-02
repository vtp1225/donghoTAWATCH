import { useState } from 'react'
import { segmentService } from '../../services/segmentService'

function buildForm(segment) {
  if (!segment) {
    return { name: '', description: '' }
  }

  return {
    name: segment.name ?? '',
    description: segment.description ?? '',
  }
}

export default function AddSegmentModal({ onClose, onSuccess, segment }) {
  const [form, setForm] = useState(() => buildForm(segment))
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const isEditMode = Boolean(segment)

  function setField(k, v) {
    setForm((prev) => ({ ...prev, [k]: v }))
  }

  function validate() {
    if (!form.name.trim()) return 'Tên phân khúc không được để trống'
    return ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const err = validate()
    if (err) {
      setError(err)
      return
    }

    setSubmitting(true)
    setError('')
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
      }

      if (isEditMode) {
        await segmentService.update(segment.id, payload)
      } else {
        await segmentService.create(payload)
      }

      onSuccess?.()
      onClose()
    } catch (submitError) {
      setError(submitError.message || (isEditMode ? 'Không thể cập nhật phân khúc' : 'Không thể tạo phân khúc'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-lg h-full bg-surface-container-low border-l border-outline-variant/20 flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-10 py-8 border-b border-outline-variant/10">
          <div>
            <span className="font-label-caps text-[10px] text-primary tracking-[0.4em] block mb-1 uppercase">Segment Console</span>
            <h2 className="font-headline-sm text-headline-sm text-on-background">{isEditMode ? 'Cập Nhật Phân Khúc' : 'Thêm Phân Khúc'}</h2>
          </div>
          <button onClick={onClose} className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">close</button>
        </div>

        {error && (
          <div className="mx-10 mt-4 px-4 py-3 border border-error/30 bg-error/10 font-label-caps text-[10px] text-error tracking-widest">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-10 py-8">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-label-caps text-[10px] tracking-widest text-on-surface-variant uppercase">Tên phân khúc</label>
              <input className="bg-transparent border-b border-outline-variant/30 py-2" value={form.name} onChange={(e) => setField('name', e.target.value)} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-label-caps text-[10px] tracking-widest text-on-surface-variant uppercase">Mô tả</label>
              <textarea className="bg-transparent border-b border-outline-variant/30 py-2 resize-none h-24" value={form.description} onChange={(e) => setField('description', e.target.value)} />
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
