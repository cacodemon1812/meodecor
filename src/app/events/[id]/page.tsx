import type { Metadata } from "next";
import { fetchEventById } from "@/data/constants";
import EventSliderClient from "@/components/EventSliderClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Props = { params: Promise<{ id: string }> };

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://meodecor.info";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const event = await fetchEventById(id);

  if (!event) {
    return { title: "Sự kiện không tìm thấy" };
  }

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
    alternates: {
      canonical: `${SITE_URL}/events/${id}`,
    },
  };
}

export default async function EventPage({ params }: Props) {
  const { id } = await params;
  const event = await fetchEventById(id);

  if (!event) {
    return <div className="container py-10">Sự kiện không tìm thấy.</div>;
  }

  return (
    <>
      <Header />

      <main className="container py-10">
        <h1 className="mb-4">{event.title}</h1>
        <p className="text-muted mb-4">{event.description}</p>

        <EventSliderClient images={event.images} />
      </main>

      <Footer />
    </>
  );
}
