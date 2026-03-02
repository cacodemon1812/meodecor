import React from "react";
import Link from "next/link";
import { fetchEvents } from "@/data/constants";
import type { EventItem } from "@/types";

export default async function EventsSection() {
  const events = await fetchEvents();

  return (
    <section id="events" className="chefs">
      <div className="container">
        <div className="section-title">
          <h2>
            Sự Kiện <span>MeoDecor</span>
          </h2>
        </div>

        <div className="row">
          {events.map((e: EventItem) => (
            <div className="col-lg-4 col-md-6" key={e.id}>
              <div className="member">
                <div className="pic">
                  <img src={e.cover} className="img-fluid" alt={e.title} />
                </div>
                <div className="member-info">
                  <h4>{e.title}</h4>
                  <div className="text-center">
                    <Link href={`/events/${e.id}`} className="meobuton">
                      Xem thêm
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
