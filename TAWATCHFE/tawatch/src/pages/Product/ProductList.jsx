import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar.jsx'
import Footer from '../../components/layout/Footer.jsx'
import ProductHero from '../../components/product/ProductHero.jsx'
import ProductFiltersSidebar from '../../components/product/ProductFiltersSidebar.jsx'
import ProductSortBar from '../../components/product/ProductSortBar.jsx'
import ProductListGrid from '../../components/product/ProductList.jsx'
import useCategoryTree from '../../hooks/useCategoryTree.js'

function collectCategoryIds(node) {
  const childIds = Array.isArray(node?.children) ? node.children.flatMap((child) => collectCategoryIds(child)) : []
  return [node.id, ...childIds]
}

function findCategoryById(categories, id) {
  for (const category of categories) {
    if (String(category.id) === String(id)) return category
    if (Array.isArray(category.children)) {
      const found = findCategoryById(category.children, id)
      if (found) return found
    }
  }
  return null
}

const DEFAULT_FILTERS = { brandIds: [], movementTypes: [], categoryIds: [], priceMax: null, name: '' }

export default function ProductPageList() {
  const [searchParams] = useSearchParams()
  const { categories } = useCategoryTree()
  const [productCount, setProductCount] = useState(0)
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [sort, setSort] = useState('newest')
  const [currentPage, setCurrentPage] = useState(0)

  const selectedCategoryId = searchParams.get('categoryId')
  const selectedBrandId = searchParams.get('brandId') ? Number(searchParams.get('brandId')) : null
  const searchQuery = searchParams.get('q') || ''

  const promoIds = useMemo(() => {
    const raw = searchParams.get('ids')
    if (!raw) return null
    const parsed = raw.split(',').map(Number).filter((n) => !isNaN(n) && n > 0)
    return parsed.length > 0 ? parsed : null
  }, [searchParams])

  const selectedCategory = useMemo(() => {
    if (!selectedCategoryId) return null
    return findCategoryById(categories, selectedCategoryId)
  }, [categories, selectedCategoryId])

  const categoryIds = useMemo(() => {
    if (!selectedCategory) return null
    return collectCategoryIds(selectedCategory)
  }, [selectedCategory])

  // Reset filters when URL params change
  useEffect(() => {
    setFilters({ ...DEFAULT_FILTERS, brandIds: selectedBrandId ? [selectedBrandId] : [], name: searchQuery })
    setCurrentPage(0)
  }, [selectedCategoryId, selectedBrandId, searchQuery])

  // Sync URL categoryId into filters.categoryIds so sidebar shows it selected
  useEffect(() => {
    if (!selectedCategoryId || !categoryIds || categoryIds.length === 0) return
    setFilters((prev) => ({ ...prev, categoryIds }))
  }, [categoryIds, selectedCategoryId])

  useEffect(() => {
    const divider = document.getElementById('hero-divider')
    const timer = window.setTimeout(() => divider?.classList.add('divider-visible'), 300)

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0')
          entry.target.classList.remove('opacity-0', 'translate-y-10')
        }
      })
    }, { threshold: 0.1 })

    document.querySelectorAll('.product-card-hover').forEach((card) => {
      card.classList.add('transition-all', 'duration-1000', 'opacity-0', 'translate-y-10')
      observer.observe(card)
    })

    return () => {
      window.clearTimeout(timer)
      observer.disconnect()
    }
  }, [])

  return (
    <div className="overflow-x-hidden bg-background font-body-md text-on-surface">
      <Navbar />

      <main className="pb-section-gap-desktop pt-32">
        <ProductHero />

        <section className="mx-auto grid max-w-7xl grid-cols-1 gap-gutter px-8 md:px-[80px] lg:grid-cols-12">
          <ProductFiltersSidebar filters={filters} onChange={setFilters} />

          <div className="lg:col-span-9">
            {promoIds && (
              <div className="mb-6 flex items-center justify-between border border-primary/25 bg-primary/5 px-5 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[18px] text-primary">local_offer</span>
                  <span className="font-label-caps text-[10px] tracking-[0.25em] uppercase text-primary">
                    Sản phẩm trong khuyến mãi — {promoIds.length} sản phẩm
                  </span>
                </div>
                <Link to="/products" className="font-label-caps text-[9px] tracking-[0.2em] uppercase text-on-surface-variant/50 transition-colors hover:text-primary">
                  Xem tất cả ×
                </Link>
              </div>
            )}
            {searchQuery && (
              <div className="mb-6 flex items-center justify-between border border-outline-variant/20 bg-surface-container-low px-5 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant/60">search</span>
                  <span className="font-label-caps text-[10px] tracking-[0.25em] uppercase text-on-surface-variant">
                    Kết quả cho &ldquo;{searchQuery}&rdquo; — {productCount} sản phẩm
                  </span>
                </div>
                <Link to="/products" className="font-label-caps text-[9px] tracking-[0.2em] uppercase text-on-surface-variant/50 transition-colors hover:text-primary">
                  Xoá tìm kiếm ×
                </Link>
              </div>
            )}
            <ProductSortBar
              count={productCount}
              label={selectedCategory?.name || ''}
              sort={sort}
              onSortChange={(s) => { setSort(s); setCurrentPage(0) }}
            />
            <ProductListGrid
              onLoaded={setProductCount}
              filters={filters}
              sort={sort}
              currentPage={currentPage}
              onPageChange={(p) => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              watchIds={promoIds}
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
