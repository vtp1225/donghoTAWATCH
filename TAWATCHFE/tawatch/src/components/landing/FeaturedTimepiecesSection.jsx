
import ProductList from '../product/ProductList.jsx'

export default function FeaturedTimepiecesSection() {
  return (
    <section className="bg-surface-container-low px-8 py-section-gap-desktop md:px-[80px]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <span className="font-label-caps text-label-caps mb-4 block uppercase tracking-widest text-primary">
            The Gallery
          </span>
          <h2 className="font-headline-md text-headline-md text-on-surface">
            Featured Timepieces
          </h2>
        </div>
        <ProductList />
      </div>
    </section>
  )
}