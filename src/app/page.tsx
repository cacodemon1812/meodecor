import TopBar from "../components/TopBar";
import Header from "../components/Header";
import Hero from "../components/Hero";
import PricingSection from "../components/PricingSection";
import EventsSection from "../components/EventsSection";
import AboutSection from "../components/AboutSection";
import GalleryTabsClient from "../components/GalleryTabsClient";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";

export default async function Home() {
  return (
    <>
      <TopBar />
      <Header />
      <Hero />

      <PricingSection />
      <EventsSection />
      <AboutSection />

      <GalleryTabsClient />

      <ContactSection />
      <Footer />
    </>
  );
}
