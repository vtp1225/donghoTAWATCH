import { useEffect, useMemo, useState } from 'react'
import ProductCard from './ProductCard.jsx'
import { productService } from '../../services/productService.js'

function applyFilters(products, categoryIds, filters, sort) {
  let result = [...products]

  if (Array.isArray(categoryIds) && categoryIds.length > 0) {
    result = result.filter((p) => categoryIds.includes(p.categoryId))
  }

  if (filters.brandIds?.length > 0) {
    result = result.filter((p) => filters.brandIds.includes(p.brandId))
  }

  if (filters.movementTypes?.length > 0) {
    result = result.filter((p) => filters.movementTypes.includes(p.movementType))
  }

  if (filters.categoryIds?.length > 0) {
    result = result.filter((p) => filters.categoryIds.includes(p.categoryId))
  }

  if (filters.priceMax != null) {
    result = result.filter((p) => p.priceRaw == null || p.priceRaw <= filters.priceMax)
  }

  if (sort === 'price_asc') {
    result.sort((a, b) => (a.priceRaw ?? 0) - (b.priceRaw ?? 0))
  } else if (sort === 'price_desc') {
    result.sort((a, b) => (b.priceRaw ?? 0) - (a.priceRaw ?? 0))
  } else {
    result.sort((a, b) => b.id - a.id)
  }

  return result
}

export default function ProductList({ categoryIds = null, onLoaded, filters = {}, sort = 'newest' }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')

    productService.getAll().then((items) => {
      if (active) setProducts(Array.isArray(items) ? items : [])
    }).catch((err) => {
      if (active) setError(err?.message || 'Không thể tải sản phẩm.')
    }).finally(() => {
      if (active) setLoading(false)
    })

    return () => { active = false }
  }, [])

  const displayed = useMemo(
    () => applyFilters(products, categoryIds, filters, sort),
    [products, categoryIds, filters, sort]
  )

  useEffect(() => {
    onLoaded?.(displayed.length)
  }, [displayed.length, onLoaded])

  if (loading) {
    return <div className="py-24 text-center font-label-caps text-xs tracking-widest text-on-surface-variant/40">ĐANG TẢI...</div>
  }

  if (error) {
    return <div className="py-24 text-center font-label-caps text-xs tracking-widest text-error">{error}</div>
  }

  if (displayed.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <span className="material-symbols-outlined text-4xl text-on-surface-variant/20">search_off</span>
        <p className="font-label-caps text-xs tracking-widest text-on-surface-variant/40">Không tìm thấy sản phẩm phù hợp</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-x-12 gap-y-24 md:grid-cols-2">
      {displayed.map((item) => (
        <ProductCard key={item.id} item={item} offsetClassName={item.offsetClassName} />
      ))}
    </div>
  )
}
