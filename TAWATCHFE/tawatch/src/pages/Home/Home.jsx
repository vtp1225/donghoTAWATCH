import Footer from '../../components/layout/Footer.jsx'
import Navbar from '../../components/layout/Navbar.jsx'
import HeroSection from '../../components/landing/HeroSection.jsx'
import HeritageSection from '../../components/landing/HeritageSection.jsx'
import QuoteSection from '../../components/landing/QuoteSection.jsx'
import SaleEventSection from '../../components/landing/SaleEventSection.jsx'
import ProductShowcaseSection from '../../components/landing/ProductShowcaseSection.jsx'

export default function Home() {
  return (
    <div className="bg-surface text-on-surface selection:bg-primary-container/30">
      <Navbar />
      <HeroSection />
      <SaleEventSection />
      <ProductShowcaseSection />
      <HeritageSection />
      <QuoteSection />
      <Footer />
    </div>
  )
}
