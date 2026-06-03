import { useNavigate } from 'react-router-dom'

export default function HeroSection() {
  const navigate = useNavigate()

  return (
    <header className="relative flex h-screen w-full items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          alt="Timeless Precision"
          className="h-full w-full scale-105 object-cover"
          src="/images/hero.jpg"
        />
        <div className="hero-overlay absolute inset-0" />
      </div>
      <div className="relative z-10 max-w-4xl px-gutter text-center">
        <div className="reveal-divider mb-8 active" />
        <h1 className="font-display-lg text-display-lg-mobile text-primary animate-fade-in md:text-display-lg mb-6">
            Đẳng cấp thời gian, tinh hoa chế tác
        </h1>
        <p
          className="font-body-lg text-body-lg mx-auto mb-12 max-w-2xl animate-fade-in text-on-surface-variant opacity-80"
          style={{ animationDelay: '0.2s' }}
        >
            TAWATCH - Nơi hội tụ những tuyệt tác đồng hồ, kết tinh từ nghệ thuật chế tác và đam mê thời gian. Khám phá bộ sưu tập độc đáo, trải nghiệm dịch vụ tận tâm và cảm nhận sự khác biệt của từng chiếc đồng hồ tại TAWATCH.
        </p>
        <div
          className="flex flex-col justify-center gap-6 animate-fade-in md:flex-row"
          style={{ animationDelay: '0.4s' }}
        >
          <button onClick={() => navigate('/products')} className="gold-border-button px-10 py-4 font-label-caps text-label-caps uppercase tracking-widest" type="button">
            Xem Bộ Sưu Tập
          </button>
          <button onClick={() => navigate('/brands')} className="border border-transparent px-10 py-4 font-label-caps text-label-caps uppercase tracking-widest text-primary transition-all hover:border-primary/20" type="button">
            Khám Phá Thương Hiệu
          </button>
        </div>
      </div>
    </header>
  )
}