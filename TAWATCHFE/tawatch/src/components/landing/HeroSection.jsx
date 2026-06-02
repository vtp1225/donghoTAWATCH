export default function HeroSection() {
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
          Timeless Precision
        </h1>
        <p
          className="font-body-lg text-body-lg mx-auto mb-12 max-w-2xl animate-fade-in text-on-surface-variant opacity-80"
          style={{ animationDelay: '0.2s' }}
        >
          Experience the quiet luxury of horological mastery, where every second is a testament to heritage and meticulous craftsmanship.
        </p>
        <div
          className="flex flex-col justify-center gap-6 animate-fade-in md:flex-row"
          style={{ animationDelay: '0.4s' }}
        >
          <button className="gold-border-button px-10 py-4 font-label-caps text-label-caps uppercase tracking-widest" type="button">
            Discover the Series
          </button>
          <button className="border border-transparent px-10 py-4 font-label-caps text-label-caps uppercase tracking-widest text-primary transition-all hover:border-primary/20" type="button">
            The Heritage
          </button>
        </div>
      </div>
    </header>
  )
}