import { useState } from 'react'
import AddSegmentModal from '../../components/admin/AddSegmentModal'
import SegmentTable from '../../components/admin/SegmentTable'
import { segmentService } from '../../services/segmentService'

export default function ManageSegment() {
  const [modalOpen, setModalOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [editTarget, setEditTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [segments, setSegments] = useState([])

  function handleSuccess() {
    setRefreshKey((k) => k + 1)
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await segmentService.remove(deleteTarget.id)
      setDeleteTarget(null)
      setRefreshKey((k) => k + 1)
    } catch (err) {
      alert(err.message || 'Không thể xoá phân khúc.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <main className="ml-72 mt-20 p-gutter min-h-screen">
      <section className="mb-16 pt-8">
        <div className="flex justify-between items-end mb-6 gap-4">
          <div className="max-w-2xl">
            <span className="font-label-caps text-label-caps text-primary tracking-[0.4em] block mb-4 uppercase">SEGMENT MANAGEMENT</span>
            <h2 className="font-display-lg text-display-lg text-on-background">Quản lý Phân Khúc</h2>
            <p className="font-body-md text-on-surface-variant/70 italic mt-2">Architecting product positioning tiers</p>
          </div>
          <button
            onClick={() => {
              setEditTarget(null)
              setModalOpen(true)
            }}
            className="px-8 py-3 border border-primary text-primary font-label-caps text-xs tracking-[0.2em] uppercase hover:bg-primary hover:text-background transition-all duration-500 active:scale-95 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Thêm Phân Khúc
          </button>
        </div>
        <div className="h-px opacity-30" style={{ background: 'linear-gradient(to right, transparent, #e9c176, transparent)' }} />
      </section>

      <SegmentTable
        key={refreshKey}
        onDataChange={setSegments}
        onDelete={setDeleteTarget}
        onEdit={(segment) => {
          setEditTarget(segment)
          setModalOpen(true)
        }}
      />

      <footer className="mt-section-gap-desktop pb-8 opacity-20">
        <div className="h-px mb-8" style={{ background: 'linear-gradient(to right, transparent, #e9c176, transparent)' }} />
        <div className="flex justify-between items-center">
          <p className="font-label-caps text-[10px] tracking-[0.2em] uppercase">Segment Console · Admin</p>
          <p className="font-label-caps text-[10px] tracking-[0.2em] uppercase">© 2026 Horological</p>
        </div>
      </footer>

      {modalOpen && (
        <AddSegmentModal
          key={editTarget?.id || 'new'}
          segment={editTarget}
          segments={segments}
          onClose={() => {
            setModalOpen(false)
            setEditTarget(null)
          }}
          onSuccess={handleSuccess}
        />
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-surface-container-low border border-outline-variant/20 p-10 max-w-sm w-full mx-4">
            <p className="font-label-caps text-[10px] text-error tracking-widest mb-4 uppercase">Xác nhận xoá</p>
            <p className="font-headline-sm text-headline-sm text-on-background mb-2">{deleteTarget.name}</p>
            <p className="font-body-md text-sm text-on-surface-variant/60 mb-8">Hành động này sẽ xoá phân khúc và có thể ảnh hưởng các sản phẩm liên quan.</p>
            <div className="flex gap-4">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-3 border border-outline-variant/30 text-on-surface-variant font-label-caps text-xs tracking-widest hover:border-primary hover:text-primary transition-all">HUỶ</button>
              <button onClick={confirmDelete} disabled={deleting} className="flex-1 py-3 bg-error text-background font-label-caps text-xs tracking-widest hover:bg-error/80 transition-all disabled:opacity-50">{deleting ? 'ĐANG XOÁ...' : 'XOÁ'}</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
