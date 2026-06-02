export default function QuoteSection() {
  return (
    <section className="bg-surface-container-lowest py-section-gap-desktop text-center">
      <div className="mx-auto max-w-3xl px-gutter">
        <span className="material-symbols-outlined mb-8 text-4xl text-primary">more_horiz</span>
        <blockquote className="font-display-lg text-headline-md leading-relaxed italic text-on-surface-variant md:text-4xl">
“Đồng hồ không chỉ đo thời gian, mà còn lưu giữ giá trị của từng khoảnh khắc.”        </blockquote>
        <cite className="mt-8 block font-label-caps text-label-caps uppercase tracking-[0.2em] text-primary">
          —  TAWatch 
        </cite>
      </div>
    </section>
  )
}