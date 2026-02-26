import Script from "next/script";
import TopBar from "../components/TopBar";
import Header from "../components/Header";
import Hero from "../components/Hero";
import PricingSection from "../components/PricingSection";
import EventsSection from "../components/EventsSection";
import AboutSection from "../components/AboutSection";
import GalleryGrid from "../components/GalleryGrid";
import GallerySection from "../components/GallerySection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import LightboxInit from "../components/LightboxInit";

export default function Home() {
  // arrays reused for the small galleries
  const boyImages = [
    "/assets/img/maubetrai/1.jpg",
    "/assets/img/maubetrai/2.jpg",
    "/assets/img/maubetrai/3.jpg",
    "/assets/img/maubetrai/4.jpg",
    "/assets/img/maubetrai/5.jpg",
    "/assets/img/maubetrai/6.jpg",
    "/assets/img/maubetrai/7.jpg",
    "/assets/img/maubetrai/8.jpg",
  ];
  const girlImages = [
    "/assets/img/MauBeGai/1.jpg",
    "/assets/img/MauBeGai/2.jpg",
    "/assets/img/MauBeGai/3.jpg",
    "/assets/img/MauBeGai/4.jpg",
    "/assets/img/MauBeGai/5.jpg",
    "/assets/img/MauBeGai/6.jpg",
    "/assets/img/MauBeGai/7.jpg",
    "/assets/img/MauBeGai/8.jpg",
  ];
  const luxuryImages = [
    "/assets/img/SangSinMin/1.jpg",
    "/assets/img/SangSinMin/2.jpg",
    "/assets/img/SangSinMin/3.jpg",
    "/assets/img/SangSinMin/4.jpg",
    "/assets/img/SangSinMin/5.jpg",
    "/assets/img/SangSinMin/6.jpg",
    "/assets/img/SangSinMin/7.jpg",
    "/assets/img/SangSinMin/8.jpg",
  ];

  return (
    <>
      <TopBar />
      <Header />
      <Hero />

      <PricingSection />
      <EventsSection />
      <AboutSection />
      <GalleryGrid />

      <GallerySection id="maubetrai" title="Mẫu bé trai" images={boyImages} />
      <GallerySection id="maubegai" title="Mẫu bé gái" images={girlImages} />
      <GallerySection id="mausangsinmin" title="Mẫu sang sịn mịn" images={luxuryImages} />

      <ContactSection />
      <Footer />

      <LightboxInit />

      {/* vendor scripts */}
      <Script
        src="/assets/vendor/bootstrap/js/bootstrap.bundle.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="/assets/vendor/glightbox/js/glightbox.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="/assets/vendor/isotope-layout/isotope.pkgd.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="/assets/vendor/swiper/swiper-bundle.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="/assets/vendor/php-email-form/validate.js"
        strategy="beforeInteractive"
      />
      <Script
        src="/assets/js/simple-lightbox.js"
        strategy="beforeInteractive"
      />
      <Script src="/assets/js/main.js" strategy="afterInteractive" />
    </>
  );
}
