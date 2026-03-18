import React from "react";
import { fetchContact } from "@/data/constants";

export default async function ContactSection() {
  const contact = await fetchContact();

  return (
    <section id="contact" className="contact">
      <div className="container">
        <div className="section-title">
          <h2>
            <span>{contact.title}</span> {contact.subtitle}
          </h2>
        </div>
      </div>
      <div className="container mt-5">
        <div className="info-wrap">
          <div className="row">
            <div className="col-lg-3 col-md-6 info">
              <i className="bi bi-geo-alt"></i>
              <h4>Địa chỉ:</h4>
              <p>{contact.address}</p>
            </div>
            <div className="col-lg-3 col-md-6 info mt-4 mt-lg-0">
              <i className="bi bi-clock"></i>
              <h4>Giờ mở cửa:</h4>
              <p>{contact.openingHours}</p>
            </div>
            <div className="col-lg-3 col-md-6 info mt-4 mt-lg-0">
              <i className="bi bi-envelope"></i>
              <h4>Fanpage:</h4>
              <p>{contact.fanpage}</p>
            </div>
            <div className="col-lg-3 col-md-6 info mt-4 mt-lg-0">
              <i className="bi bi-phone"></i>
              <h4>Call:</h4>
              <p>{contact.phone}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="map">
        <iframe
          style={{ border: 0, width: "100%", height: "350px" }}
          src={contact.mapEmbedUrl}
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>
    </section>
  );
}
