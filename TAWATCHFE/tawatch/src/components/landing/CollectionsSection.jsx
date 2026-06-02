export default function CollectionsSection() {
  return (
    <section id="collections" className="bg-surface px-8 py-section-gap-desktop md:px-[80px]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <span className="font-label-caps text-label-caps mb-4 block uppercase tracking-widest text-primary">
              The Selection
            </span>
            <h2 className="font-headline-md text-headline-md text-on-surface">
              Curated Collections
            </h2>
          </div>
          <p className="font-body-md text-body-md max-w-sm text-on-surface-variant">
            A legacy defined by attention to detail, available in distinct signatures of style.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-gutter md:grid-cols-12">
          <div className="card-hover-border group relative aspect-[16/9] cursor-pointer overflow-hidden md:col-span-8">
            <img
              alt="Grand Complication"
              className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
              src="/images/collection-grand.jpg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-60" />
            <div className="absolute bottom-8 left-8">
              <span className="mb-4 inline-block border border-primary px-3 py-1 text-[10px] uppercase text-primary">
                Featured
              </span>
              <h3 className="mb-2 font-headline-sm text-headline-sm text-on-surface">
                Grand Complication
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant transition-colors group-hover:text-primary">
                View Series —&gt;
              </p>
            </div>
          </div>
          <div className="card-hover-border group relative aspect-square cursor-pointer overflow-hidden md:col-span-4">
            <img
              alt="The Atelier"
              className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
              src="/images/collection-atelier.jpg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-60" />
            <div className="absolute bottom-8 left-8">
              <h3 className="mb-2 font-headline-sm text-headline-sm text-on-surface">
                The Atelier
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant transition-colors group-hover:text-primary">
                Custom Straps —&gt;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}