import { useEffect, useMemo, useState } from 'react'
import ProductCard from './ProductCard.jsx'
import { productService } from '../../services/productService.js'
import { wishlistService } from '../../services/wishlistService.js'

function getStoredUserId() {
  try {
    const stored = window.localStorage.getItem('auth_user')
    if (!stored) return null
    return JSON.parse(stored)?.id ?? null
  } catch {
    return null
  }
}

const PAGE_SIZE = 10

function sortClientSide(products, sort) {
  if (sort === 'price_asc') return [...products].sort((a, b) => (a.priceRaw ?? 0) - (b.priceRaw ?? 0))
  if (sort === 'price_desc') return [...products].sort((a, b) => (b.priceRaw ?? 0) - (a.priceRaw ?? 0))
  return products
}

function hasActiveFilters(filters) {
  return (
    filters.brandIds?.length > 0 ||
    filters.movementTypes?.length > 0 ||
    filters.categoryIds?.length > 0 ||
    filters.priceMax != null ||
    (filters.name && filters.name.trim().length > 0)
  )
}

export default function ProductList({ onLoaded, filters = {}, sort = 'newest', currentPage = 0, onPageChange, watchIds = null }) {
  const [pagedData, setPagedData] = useState({ content: [], totalPages: 0, totalElements: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [wishlistIds, setWishlistIds] = useState(new Set())

  useEffect(() => {
    const userId = getStoredUserId()
    if (!userId) return
    wishlistService.getWishlist(userId)
      .then((items) => setWishlistIds(new Set(Array.isArray(items) ? items.map((i) => i.variantId) : [])))
      .catch(() => {})

    const handler = () => {
      const uid = getStoredUserId()
      if (!uid) { setWishlistIds(new Set()); return }
      wishlistService.getWishlist(uid)
        .then((items) => setWishlistIds(new Set(Array.isArray(items) ? items.map((i) => i.variantId) : [])))
        .catch(() => {})
    }
    window.addEventListener('wishlist:updated', handler)
    window.addEventListener('auth:logout', () => setWishlistIds(new Set()))
    return () => window.removeEventListener('wishlist:updated', handler)
  }, [])

  const isPriceSort = sort === 'price_asc' || sort === 'price_desc'
  const filtering = hasActiveFilters(filters)
  // Serialize filters để detect thay đổi thực sự, tránh re-fetch do object reference mới
  const filtersKey = useMemo(() => JSON.stringify({
    n: filters.name,
    b: filters.brandIds,
    c: filters.categoryIds,
    m: filters.movementTypes,
    p: filters.priceMax,
  }), [filters.name, filters.brandIds, filters.categoryIds, filters.movementTypes, filters.priceMax])

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')

    if (watchIds !== null) {
      productService.getByIds(watchIds).then((items) => {
        if (!active) return
        const sorted = sortClientSide(Array.isArray(items) ? items : [], sort)
        setPagedData({ content: sorted, totalPages: 1, totalElements: sorted.length })
      }).catch((err) => {
        if (active) setError(err?.message || 'Không thể tải sản phẩm.')
      }).finally(() => { if (active) setLoading(false) })
      return () => { active = false }
    }

    if (filtering || isPriceSort) {
      // Server-side filter với phân trang — không cần load toàn bộ
      productService.search({
        name: filters.name?.trim() || undefined,
        brandIds: filters.brandIds?.length ? filters.brandIds : undefined,
        categoryIds: filters.categoryIds?.length ? filters.categoryIds : undefined,
        movementTypes: filters.movementTypes?.length ? filters.movementTypes : undefined,
        maxPrice: filters.priceMax ?? undefined,
        page: currentPage,
        size: PAGE_SIZE,
      }).then((data) => {
        if (!active) return
        const sorted = isPriceSort ? sortClientSide(data.content, sort) : data.content
        setPagedData({ ...data, content: sorted })
      }).catch((err) => {
        if (active) setError(err?.message || 'Không thể tải sản phẩm.')
      }).finally(() => { if (active) setLoading(false) })
    } else {
      productService.getPaged(currentPage, PAGE_SIZE).then((data) => {
        if (active) setPagedData(data)
      }).catch((err) => {
        if (active) setError(err?.message || 'Không thể tải sản phẩm.')
      }).finally(() => { if (active) setLoading(false) })
    }

    return () => { active = false }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filtersKey, sort, watchIds])

  useEffect(() => {
    onLoaded?.(pagedData.totalElements)
  }, [pagedData.totalElements, onLoaded])

  if (loading) {
    return <div className="py-24 text-center font-label-caps text-xs tracking-widest text-on-surface-variant/40">ĐANG TẢI...</div>
  }

  if (error) {
    return <div className="py-24 text-center font-label-caps text-xs tracking-widest text-error">{error}</div>
  }

  if (pagedData.content.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <span className="material-symbols-outlined text-4xl text-on-surface-variant/20">search_off</span>
        <p className="font-label-caps text-xs tracking-widest text-on-surface-variant/40">Không tìm thấy sản phẩm phù hợp</p>
      </div>
    )
  }

  const showPagination = pagedData.totalPages > 1 && watchIds === null

  return (
    <div>
      <div className="grid grid-cols-1 gap-x-12 gap-y-24 md:grid-cols-2">
        {pagedData.content.map((item) => (
          <ProductCard
            key={item.id}
            item={item}
            offsetClassName={item.offsetClassName}
            wishlisted={item.variantId != null && wishlistIds.has(item.variantId)}
          />
        ))}
      </div>

      {showPagination && (
        <div className="mt-16 flex items-center justify-center gap-2">
          <button
            onClick={() => onPageChange?.(currentPage - 1)}
            disabled={currentPage === 0}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-outline/20 font-label-caps text-xs tracking-widest text-on-surface transition-colors hover:bg-surface-variant disabled:cursor-not-allowed disabled:opacity-30"
          >
            <span className="material-symbols-outlined text-base">chevron_left</span>
          </button>

          {Array.from({ length: pagedData.totalPages }, (_, i) => {
            const isActive = i === currentPage
            const isNearby = Math.abs(i - currentPage) <= 2
            if (!isNearby && i !== 0 && i !== pagedData.totalPages - 1) {
              if (i === currentPage - 3 || i === currentPage + 3) {
                return <span key={i} className="px-1 text-on-surface-variant/40">…</span>
              }
              return null
            }
            return (
              <button
                key={i}
                onClick={() => onPageChange?.(i)}
                className={`flex h-10 w-10 items-center justify-center rounded-full font-label-caps text-xs tracking-widest transition-colors ${
                  isActive
                    ? 'bg-on-surface text-surface'
                    : 'border border-outline/20 text-on-surface hover:bg-surface-variant'
                }`}
              >
                {i + 1}
              </button>
            )
          })}

          <button
            onClick={() => onPageChange?.(currentPage + 1)}
            disabled={currentPage >= pagedData.totalPages - 1}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-outline/20 font-label-caps text-xs tracking-widest text-on-surface transition-colors hover:bg-surface-variant disabled:cursor-not-allowed disabled:opacity-30"
          >
            <span className="material-symbols-outlined text-base">chevron_right</span>
          </button>
        </div>
      )}
    </div>
  )
}
