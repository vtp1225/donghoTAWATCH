import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
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

const DEFAULT_FILTERS = { brandIds: [], movementTypes: [], categoryIds: [], priceMax: null }

export default function ProductPageList() {
  const [searchParams] = useSearchParams()
  const { categories } = useCategoryTree()
  const [productCount, setProductCount] = useState(0)
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [sort, setSort] = useState('newest')

  const selectedCategoryId = searchParams.get('categoryId')
  const selectedBrandId = searchParams.get('brandId') ? Number(searchParams.get('brandId')) : null

  const selectedCategory = useMemo(() => {
    if (!selectedCategoryId) return null
    return findCategoryById(categories, selectedCategoryId)
  }, [categories, selectedCategoryId])

  const categoryIds = useMemo(() => {
    if (!selectedCategory) return null
    return collectCategoryIds(selectedCategory)
  }, [selectedCategory])

  // Sync URL brandId into filters
  useEffect(() => {
    setFilters((prev) => ({
      ...DEFAULT_FILTERS,
      brandIds: selectedBrandId ? [selectedBrandId] : [],
    }))
  }, [selectedCategoryId, selectedBrandId])

  useEffect(() => {
    const divider = document.getElementById('hero-divider')
    const timer = window.setTimeout(() => divider?.classList.add('divider-visible'), 300)

    const handleScroll = () => {
      const scrolled = window.pageYOffset
      document.querySelectorAll('.product-card-hover').forEach((card, index) => {
        const img = card.querySelector('img')
        if (img) img.style.transform = `translateY(${scrolled * (index % 2 === 0 ? 0.05 : -0.05)}px)`
      })
    }

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

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('scroll', handleScroll)
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
            <ProductSortBar
              count={productCount}
              label={selectedCategory?.name || ''}
              sort={sort}
              onSortChange={setSort}
            />
            <ProductListGrid
              categoryIds={categoryIds}
              onLoaded={setProductCount}
              filters={filters}
              sort={sort}
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
