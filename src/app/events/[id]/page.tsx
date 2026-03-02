import React from "react";
import { fetchEventById } from "@/data/constants";
import EventSliderClient from "@/components/EventSliderClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Props = { params: { id: string } };

export default async function EventPage({ params }: Props) {
  const { id } = (await params) as { id: string };
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
