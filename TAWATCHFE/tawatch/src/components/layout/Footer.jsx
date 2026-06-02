export default function Footer() {
  return (
    <footer id="footer" className="w-full border-t border-outline-variant/10 bg-surface-container-low py-section-gap-desktop">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-gutter px-8 md:grid-cols-4 md:px-[80px]">
        <div className="col-span-1">
          <div className="mb-6 font-headline-sm text-headline-sm text-primary">TAWatch</div>
          <p className="mb-6 font-body-md text-body-md text-on-surface-variant">
            Redefining horological excellence through the lens of quiet luxury and mechanical perfection.
          </p>
          <div className="flex gap-4">
            <span className="material-symbols-outlined cursor-pointer text-on-surface-variant transition-colors hover:text-primary">
              language
            </span>
            <span className="material-symbols-outlined cursor-pointer text-on-surface-variant transition-colors hover:text-primary">
              public
            </span>
          </div>
        </div>
        <div>
          <h4 className="mb-6 font-label-caps text-label-caps uppercase tracking-widest text-on-surface">
            Collections
          </h4>
          <ul className="space-y-4">
            <li>
              <a className="font-body-md text-body-md text-on-surface-variant transition-colors hover:text-primary" href="#collections">
                Heritage Series
              </a>
            </li>
            <li>
              <a className="font-body-md text-body-md text-on-surface-variant transition-colors hover:text-primary" href="#collections">
                Modern Minimalist
              </a>
            </li>
            <li>
              <a className="font-body-md text-body-md text-on-surface-variant transition-colors hover:text-primary" href="#collections">
                Grand Complications
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-6 font-label-caps text-label-caps uppercase tracking-widest text-on-surface">
            Support
          </h4>
          <ul className="space-y-4">
            <li>
              <a className="font-body-md text-body-md text-on-surface-variant transition-colors hover:text-primary" href="#">
                Service &amp; Care
              </a>
            </li>
            <li>
              <a className="font-body-md text-body-md text-on-surface-variant transition-colors hover:text-primary" href="#">
                Warranty
              </a>
            </li>
            <li>
              <a className="font-body-md text-body-md text-on-surface-variant transition-colors hover:text-primary" href="#">
                Contact Us
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-6 font-label-caps text-label-caps uppercase tracking-widest text-on-surface">
            Legal
          </h4>
          <ul className="space-y-4">
            <li>
              <a className="font-body-md text-body-md text-on-surface-variant transition-colors hover:text-primary" href="#">
                Privacy Policy
              </a>
            </li>
            <li>
              <a className="font-body-md text-body-md text-on-surface-variant transition-colors hover:text-primary" href="#">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-20 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-outline-variant/10 px-8 pt-8 md:flex-row md:px-[80px]">
        <div className="font-body-md text-body-md text-on-surface-variant opacity-50">
          © 2024 TAWatch. Excellence in Horology.
        </div>
        <div className="font-label-caps text-[10px] uppercase tracking-[0.3em] text-primary">
          Built for Eternity
        </div>
      </div>
    </footer>
  )
}
