import TopBar from "../components/TopBar";
import Header from "../components/Header";
import Hero from "../components/Hero";
import PricingSection from "../components/PricingSection";
import EventsSection from "../components/EventsSection";
import AboutSection from "../components/AboutSection";
import GalleryTabsClient from "../components/GalleryTabsClient";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import { BOY_IMAGES, GIRL_IMAGES, LUXURY_IMAGES } from "../data/gallery";

const GALLERY_TABS = [
  { id: "maubetrai", label: "Mẫu bé trai", images: BOY_IMAGES },
  { id: "maubegai", label: "Mẫu bé gái", images: GIRL_IMAGES },
  { id: "mausangsinmin", label: "Mẫu sang sịn mịn", images: LUXURY_IMAGES },
];

export default function Home() {
  return (
    <>
      <TopBar />
      <Header />
      <Hero />

      <PricingSection />
      <EventsSection />
      <AboutSection />

      <GalleryTabsClient tabs={GALLERY_TABS} />

      <ContactSection />
      <Footer />
    </>
  );
}
