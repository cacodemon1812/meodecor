import TopBar from "../components/TopBar";
import Header from "../components/Header";
import Hero from "../components/Hero";
import PricingSection from "../components/PricingSection";
import EventsSection from "../components/EventsSection";
import AboutSection from "../components/AboutSection";
import GalleryTabsClient from "../components/GalleryTabsClient";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import { fetchGalleryTabs } from "../data/constants";

export default async function Home() {
  const galleryTabs = await fetchGalleryTabs();

  return (
    <>
      <TopBar />
      <Header />
      <Hero />

      <PricingSection />
      <EventsSection />
      <AboutSection />

      <GalleryTabsClient tabs={galleryTabs} />

      <ContactSection />
      <Footer />
    </>
  );
}
