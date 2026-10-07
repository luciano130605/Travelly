import {
  WhatsAppButton,
  Hero,
  Problem,
  Profile,
  Packing,
  Travy,
  Footer,
} from '../components/landing'
import Functions from '../components/landing/Functions'
import Header from '../components/landing/Header'
import Trip from '../components/landing/Trip'
import Cookies from '../components/cookies'
import SocialProof from '../components/landing/SocialProof'

export default function LandingPage() {
  return (
    <div id="top">
      <Cookies />
      <WhatsAppButton />
      <Header />
      <main>
        <Hero />
        <Problem />
        <Profile />

        <Packing />
        <Functions />
        <Trip />
        <SocialProof />
        <Travy />
      </main>
      <Footer />
    </div>
  )
}
