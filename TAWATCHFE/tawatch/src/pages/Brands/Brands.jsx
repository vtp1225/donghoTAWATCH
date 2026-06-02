import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar.jsx'
import Footer from '../../components/layout/Footer.jsx'
import { brandService } from '../../services/brandService.js'

export default function Brands() {
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    brandService.getAll()
      .then((data) => setBrands(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Navbar />

      <main className="pt-20">
        {/* Hero */}
        <section className="relative flex h-52 items-end border-b border-outline-variant/10 px-8 pb-10 md:px-[80px]">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface-container-low/60" />
          <div className="relative mx-auto w-full max-w-7xl">
            <p className="mb-2 font-label-caps text-[10px] tracking-[0.35em] text-on-surface-variant/60 uppercase">
              Khám phá
            </p>
            <h1 className="font-headline-md text-3xl tracking-[0.12em] uppercase text-on-surface">
              Thương Hiệu
            </h1>
            <div className="mt-4 h-px w-16 bg-gradient-to-r from-primary to-transparent" />
          </div>
        </section>

        {/* Grid */}
        <section className="mx-auto max-w-7xl px-8 py-16 md:px-[80px]">
          {loading ? (
            <div className="py-24 text-center font-label-caps text-xs tracking-widest text-on-surface-variant/40">
              Đang tải...
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-px bg-outline-variant/10 sm:grid-cols-3 lg:grid-cols-4">
              {brands.map((brand) => (
                <Link
                  key={brand.id}
                  to={`/products?brandId=${brand.id}`}
                  className="group relative flex flex-col items-center justify-center gap-5 bg-surface px-6 py-12 transition-all duration-300 hover:bg-surface-container"
                >
                  {/* Decorative initial */}
                  <div className="flex h-16 w-16 items-center justify-center border border-outline-variant/20 transition-all duration-300 group-hover:border-primary/40">
                    <span className="font-headline-md text-2xl text-on-surface-variant/30 transition-colors duration-300 group-hover:text-primary/60">
                      {brand.name.charAt(0)}
                    </span>
                  </div>

                  <div className="text-center">
                    <p className="font-label-caps text-[11px] tracking-[0.2em] uppercase text-on-surface transition-colors duration-300 group-hover:text-primary">
                      {brand.name}
                    </p>
                  </div>

                  {/* Arrow */}
                  <span className="absolute bottom-4 right-5 translate-y-1 font-label-caps text-[10px] tracking-widest text-primary opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    →
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
