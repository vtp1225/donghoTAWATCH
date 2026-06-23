import { useState, useCallback, useMemo } from 'react'
import StatsGrid from '../../components/admin/StatsGrid'
import InventoryTable from '../../components/admin/InventoryTable'
import WatchModal from '../../components/admin/WatchModal'
import { watchService } from '../../services/watchService'

export default function ManageProduct() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Stats come FREE from InventoryTable's existing load — no extra API call
  const [tableStats, setTableStats] = useState(null)

  const handleStatsLoad = useCallback(({ total, outOfStock, lowStock, isFiltered }) => {
    if (!isFiltered) setTableStats({ total, outOfStock, lowStock })
  }, [])

  const stats = useMemo(() => {
    const total      = tableStats?.total      ?? null
    const outOfStock = tableStats?.outOfStock ?? null
    const lowStock   = tableStats?.lowStock   ?? null

    return [
      {
        label: 'Tổng sản phẩm',
        value: total != null ? total.toString() : null,
        icon: 'inventory_2',
        detail: total != null ? 'Trong kho hàng' : null,
      },
      {
        label: 'Sắp hết hàng',
        value: lowStock != null ? lowStock.toString() : null,
        icon: 'warning',
        accent: lowStock > 0 ? 'text-amber-400' : 'text-on-background',
        detail: lowStock != null
          ? (lowStock > 0 ? 'Tồn kho dưới 5 chiếc' : 'Không có')
          : null,
        detailColor: lowStock > 0 ? 'text-amber-400/70' : 'text-on-surface-variant/40',
      },
      {
        label: 'Hết hàng',
        value: outOfStock != null ? outOfStock.toString() : null,
        icon: 'remove_shopping_cart',
        accent: outOfStock > 0 ? 'text-error' : 'text-on-background',
        detail: outOfStock != null
          ? (outOfStock > 0 ? 'Cần nhập thêm hàng' : 'Tất cả còn hàng')
          : null,
        detailColor: outOfStock > 0 ? 'text-error/60' : 'text-on-surface-variant/40',
      },
    ]
  }, [tableStats])

  function handleSuccess() {
    setRefreshKey((k) => k + 1)
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await watchService.delete(deleteTarget.id)
      setDeleteTarget(null)
      setRefreshKey((k) => k + 1)
    } catch (err) {
      alert(err.message || 'Không thể xoá sản phẩm.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <main className="ml-72 mt-20 min-h-screen overflow-x-hidden" style={{ padding: '24px 32px' }}>
      {/* Header */}
      <section className="mb-16 pt-8">
        <div className="flex justify-between items-end mb-6">
          <div className="max-w-2xl">
            <span className="font-label-caps text-label-caps text-primary tracking-[0.4em] block mb-4 uppercase">
            </span>
            <h2 className="font-display-lg text-display-lg text-on-background">Kho Hàng</h2>
          </div>
          <button
            onClick={() => {
              setEditTarget(null)
              setModalOpen(true)
            }}
            className="px-8 py-3 border border-primary text-primary font-label-caps text-xs tracking-[0.2em] uppercase hover:bg-primary hover:text-background transition-all duration-500 active:scale-95 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Thêm Sản Phẩm
          </button>
        </div>
        <div
          className="h-px opacity-30"
          style={{ background: 'linear-gradient(to right, transparent, #e9c176, transparent)' }}
        />
      </section>

      <StatsGrid stats={stats} loading={tableStats === null} />
      <InventoryTable refreshKey={refreshKey} onStatsLoad={handleStatsLoad} onDelete={setDeleteTarget} onEdit={(watch) => {
        setEditTarget(watch)
        setModalOpen(true)
      }} />

      {/* Footer */}
      <footer className="mt-section-gap-desktop pb-8 opacity-20">
        <div
          className="h-px mb-8"
          style={{ background: 'linear-gradient(to right, transparent, #e9c176, transparent)' }}
        />
        <div className="flex justify-between items-center">
          <p className="font-label-caps text-[10px] tracking-[0.2em] uppercase">Security Level: Gold Tier</p>
          <p className="font-label-caps text-[10px] tracking-[0.2em] uppercase">© 2024 Horological Heritage Archive</p>
        </div>
      </footer>

      {/* Add watch modal */}
      <WatchModal
        open={modalOpen}
        watch={editTarget}
        onClose={() => {
          setModalOpen(false)
          setEditTarget(null)
        }}
        onSuccess={handleSuccess}
      />

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-surface-container-low border border-outline-variant/20 p-10 max-w-sm w-full mx-4">
            <p className="font-label-caps text-[10px] text-error tracking-widest mb-4 uppercase">Xác nhận xoá</p>
            <p className="font-headline-sm text-headline-sm text-on-background mb-2">{deleteTarget.name}</p>
            <p className="font-label-caps text-[10px] text-on-surface-variant mb-8">{deleteTarget.sku}</p>
            <p className="font-body-md text-sm text-on-surface-variant/60 mb-8">
              Hành động này không thể hoàn tác. Tất cả biến thể và ảnh liên quan cũng sẽ bị xoá.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-3 border border-outline-variant/30 text-on-surface-variant font-label-caps text-xs tracking-widest hover:border-primary hover:text-primary transition-all"
              >
                HUỶ
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 py-3 bg-error text-background font-label-caps text-xs tracking-widest hover:bg-error/80 transition-all disabled:opacity-50"
              >
                {deleting ? 'ĐANG XOÁ...' : 'XOÁ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
