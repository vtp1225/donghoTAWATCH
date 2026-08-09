import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar.jsx'
import Footer from '../../components/layout/Footer.jsx'

export default function NotFound() {
  const location = useLocation()
  const gearRef = useRef(null)

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!gearRef.current) return
      const x = (e.clientX / window.innerWidth - 0.5) * 15
      const y = (e.clientY / window.innerHeight - 0.5) * 15
      gearRef.current.style.transform = `translate(${x}px, ${y}px)`
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Navbar />

      {/* Gear background */}
      <div className="gear-overlay fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
        <span
          ref={gearRef}
          className="material-symbols-outlined text-[700px] animate-[spin_90s_linear_infinite] opacity-[0.03]"
        >
          settings
        </span>
      </div>

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-8 pt-20 text-center">
        {/* Decorative line top */}
        <div className="mb-10 h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent" />

        {/* Label */}
        <p className="mb-4 font-label-caps text-[10px] tracking-[0.5em] text-primary uppercase">
          Lỗi · Error
        </p>

        {/* 404 number */}
        <h1 className="relative mb-2 select-none font-headline-md leading-none tracking-tighter text-on-surface/5"
          style={{ fontSize: 'clamp(120px, 20vw, 280px)' }}
        >
          404
          <span
            className="absolute inset-0 flex items-center justify-center font-headline-md leading-none tracking-tighter text-on-surface"
            style={{ fontSize: 'clamp(120px, 20vw, 280px)', WebkitTextStroke: '1px rgba(var(--color-primary-rgb, 192 152 83) / 0.3)' }}
            aria-hidden="true"
          >
            404
          </span>
        </h1>

        {/* Divider */}
        <div className="my-8 flex items-center gap-4">
          <div className="h-px w-12 bg-outline-variant/30" />
          <span className="material-symbols-outlined text-[20px] text-primary/60">watch</span>
          <div className="h-px w-12 bg-outline-variant/30" />
        </div>

        {/* Message */}
        <h2 className="mb-3 font-headline-md text-xl tracking-widest uppercase text-on-surface">
          Trang không tìm thấy
        </h2>
        <p className="mb-2 max-w-md font-body-md text-sm text-on-surface-variant">
          Đường dẫn{' '}
          <code className="rounded bg-surface-container px-1.5 py-0.5 font-mono text-xs text-primary/80">
            {location.pathname}
          </code>{' '}
          không tồn tại.
        </p>
        <p className="mb-12 font-body-md text-sm text-on-surface-variant/60">
          Trang có thể đã được di chuyển, xoá hoặc chưa từng tồn tại.
        </p>

        {/* Actions */}
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Link
            to="/"
            className="gold-border-button group relative overflow-hidden bg-transparent px-10 py-4 font-label-caps text-label-caps text-primary transition-all duration-700 ease-out hover:text-surface"
          >
            <span className="relative z-10 tracking-widest">VỀ TRANG CHỦ</span>
            <span className="absolute inset-0 -translate-x-full bg-primary transition-transform duration-700 ease-out group-hover:translate-x-0" />
          </Link>

          <Link
            to="/products"
            className="px-10 py-4 font-label-caps text-label-caps text-on-surface-variant underline underline-offset-4 transition-colors hover:text-primary"
          >
            XEM SẢN PHẨM
          </Link>
        </div>

        {/* Decorative line bottom */}
        <div className="mt-16 h-px w-24 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        {/* Quote */}
        <p className="mt-8 max-w-xs font-body-md text-[11px] italic text-on-surface-variant/40">
          "Thời gian không chờ đợi ai — nhưng chúng tôi luôn ở đây."
        </p>
      </main>

      <Footer />
    </div>
  )
}
