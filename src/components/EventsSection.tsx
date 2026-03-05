import React from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchEvents } from "@/data/constants";
import type { EventItem } from "@/types";

export default async function EventsSection() {
  const events = await fetchEvents();

  return (
    <section id="events" className="events-showcase">
      <div className="container">
        <div className="section-title">
          <h2>
            Sự Kiện <span>MeoDecor</span>
          </h2>
          <p>
            Những concept trang trí nổi bật được thiết kế riêng cho từng khoảnh
            khắc.
          </p>
        </div>

        <div className="row g-4">
          {events.map((e: EventItem, index: number) => (
            <div className="col-lg-4 col-md-6" key={e.id}>
              <article
                className="event-card event-reveal h-100"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <div className="event-card-media">
                  <Image
                    src={e.cover}
                    alt={e.title}
                    width={720}
                    height={480}
                    className="img-fluid"
                  />
                  <span className="event-chip">0{index + 1}</span>
                </div>
                <div className="event-card-body">
                  <h4>{e.title}</h4>
                  <p>{e.description}</p>
                  <div className="text-center mt-3">
                    <Link href={`/events/${e.id}`} className="meobuton">
                      Xem thêm
                    </Link>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
