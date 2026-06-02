import Footer from '../../components/layout/Footer.jsx'
import Navbar from '../../components/layout/Navbar.jsx'
import HeroSection from '../../components/landing/HeroSection.jsx'
import CollectionsSection from '../../components/landing/CollectionsSection.jsx'
import FeaturedTimepiecesSection from '../../components/landing/FeaturedTimepiecesSection.jsx'
import HeritageSection from '../../components/landing/HeritageSection.jsx'
import QuoteSection from '../../components/landing/QuoteSection.jsx'

export default function Home() {
  return (
    <div className="bg-surface text-on-surface selection:bg-primary-container/30">
      <Navbar />
      <HeroSection />
      <CollectionsSection />
      <FeaturedTimepiecesSection />
      <HeritageSection />
      <QuoteSection />
      <Footer />
    </div>
  )
}
