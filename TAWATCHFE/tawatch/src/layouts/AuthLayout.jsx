import AuthNavbar from '../components/auth/AuthNavbar.jsx'

const footerLinks = ['Privacy Policy', 'Terms of Service', 'Contact', 'Warranty', 'Press']

export function Headers() {
  return (
    <div className="mb-12">
      <h1 className="mb-2 font-display-lg text-headline-sm tracking-widest text-primary">TAWatch</h1>
      <p className="font-label-caps text-[10px] tracking-[0.3em] text-on-surface-variant">HOROLOGICAL EXCELLENCE</p>
    </div>
  )
}

export function AuthFooter() {
  return (
    <footer id="footer" className="flex flex-col items-center gap-gutter border-t border-outline-variant/30 bg-surface px-gutter py-section-gap-mobile text-center md:px-[80px] md:py-section-gap-desktop">
      <div className="mb-gutter font-headline-md text-headline-md uppercase tracking-widest text-primary">
        TAWatch
      </div>
      <div className="flex flex-wrap justify-center gap-8">
        {footerLinks.map((item) => (
          <a
            key={item}
            className="font-label-caps text-label-caps text-on-surface-variant transition-colors duration-500 hover:text-primary"
            href="#"
          >
            {item}
          </a>
        ))}
      </div>
      <p className="font-body-md text-body-md text-on-surface-variant/60">
        © 2024 TAWatch. Precision in Every Second.
      </p>
    </footer>
  )
}

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-background text-on-background">
      <AuthNavbar />
      <main className="relative isolate overflow-hidden pt-20">
        {children}
      </main>
      <AuthFooter />
    </div>
  )
}
