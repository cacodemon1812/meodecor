import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { fetchEventById, fetchEvents } from "@/data/constants";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EventGalleryClient from "@/components/EventGalleryClient";
import type { EventItem } from "@/types";

type Props = { params: Promise<{ id: string }> };

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://meodecor.info";

/* ── Metadata ───────────────────────────────────────────────── */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const event = await fetchEventById(id);

  if (!event) return { title: "Sự kiện không tìm thấy" };

  const title = `${event.title} – Trang Trí Sự Kiện Meo Decor`;
  const description = `${event.description} Dịch vụ trang trí sự kiện chuyên nghiệp tại Nam Định, Hà Nam, Thái Bình, Ninh Bình.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/events/${id}`,
      images: event.cover
        ? [{ url: event.cover, width: 1200, height: 630, alt: event.title }]
        : [],
    },
    alternates: { canonical: `${SITE_URL}/events/${id}` },
  };
}

/* ── Page ───────────────────────────────────────────────────── */
export default async function EventPage({ params }: Props) {
  const { id } = await params;
  const [event, allEvents] = await Promise.all([
    fetchEventById(id),
    fetchEvents(),
  ]);

  /* 404 */
  if (!event) {
    return (
      <>
        <Header />
        <main
          className="container"
          style={{ paddingTop: 160, paddingBottom: 80, minHeight: "60vh" }}
        >
          <h1 style={{ fontFamily: '"Dancing Script", cursive', fontSize: "2rem" }}>
            Sự kiện không tìm thấy
          </h1>
          <Link
            href="/#events"
            style={{ color: "#ffb03b", fontWeight: 600, textDecoration: "none" }}
          >
            ← Quay lại sự kiện
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const relatedEvents = (allEvents as EventItem[])
    .filter((e) => e.id !== id)
    .slice(0, 2);

  return (
    <>
      <Header />

      {/* ── Hero ── */}
      <div className="event-hero">
        <Image
          src={event.cover}
          alt={event.title}
          fill
          priority
          sizes="100vw"
          className="event-hero-img"
        />
        <div className="event-hero-overlay" />
        <div className="event-hero-content">
          <div className="container">
            <span className="event-hero-badge">✦ Meo Decor</span>
            <h1 className="event-hero-title">{event.title}</h1>
            <p className="event-hero-desc">{event.description}</p>
          </div>
        </div>
      </div>

      <main>
        {/* ── Breadcrumb ── */}
        <div className="container">
          <nav className="event-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Trang chủ</Link>
            <span className="sep">/</span>
            <Link href="/#events">Sự kiện</Link>
            <span className="sep">/</span>
            <span className="current">{event.title}</span>
          </nav>
        </div>

        {/* ── Gallery ── */}
        <section className="event-gallery-section">
          <div className="container">
            <div className="section-title">
              <h2>
                Bộ Ảnh <span>Sự Kiện</span>
              </h2>
              <p>Click vào ảnh để xem full màn hình</p>
            </div>
            <EventGalleryClient images={event.images} title={event.title} />
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="event-cta-section">
          <div className="container">
            <h3>Bạn muốn tổ chức sự kiện tương tự?</h3>
            <p>
              Liên hệ Meo Decor để được tư vấn và báo giá miễn phí
            </p>
            <Link href="/#contact" className="event-cta-btn">
              Liên hệ ngay →
            </Link>
          </div>
        </section>

        {/* ── Related events ── */}
        {relatedEvents.length > 0 && (
          <section className="event-related-section">
            <div className="container">
              <div className="section-title">
                <h2>
                  Sự Kiện <span>Khác</span>
                </h2>
              </div>
              <div className="event-related-grid">
                {relatedEvents.map((e) => (
                  <Link
                    key={e.id}
                    href={`/events/${e.id}`}
                    className="event-related-card"
                  >
                    <div className="event-related-img-wrapper">
                      <Image
                        src={e.cover}
                        alt={e.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="event-related-img"
                      />
                      <div className="event-related-overlay" />
                    </div>
                    <div className="event-related-body">
                      <h4>{e.title}</h4>
                      <p>{e.description}</p>
                      <span className="event-related-link">Xem thêm →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
