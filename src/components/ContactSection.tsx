import React from "react";

export default function ContactSection() {
  return (
    <section id="contact" className="contact">
      <div className="container">
        <div className="section-title">
          <h2><span>Liên hệ ngay với</span> Meo Decor - Party & Event Baby</h2>
        </div>
      </div>
      <div className="container mt-5">
        <div className="info-wrap">
          <div className="row">
            <div className="col-lg-3 col-md-6 info">
              <i className="bi bi-geo-alt"></i>
              <h4>Địa chỉ:</h4>
              <p>68/75 Điện Biên - Cửa Bắc - Tp Nam Định</p>
            </div>
            <div className="col-lg-3 col-md-6 info mt-4 mt-lg-0">
              <i className="bi bi-clock"></i>
              <h4>Giờ mở cửa:</h4>
              <p>
                Cả tuần:<br />6:00 AM - 23:00 PM
              </p>
            </div>
            <div className="col-lg-3 col-md-6 info mt-4 mt-lg-0">
              <i className="bi bi-envelope"></i>
              <h4>Fanpage:</h4>
              <p>https://https://www.facebook.com/meodecorpartyeventbaby</p>
            </div>
            <div className="col-lg-3 col-md-6 info mt-4 mt-lg-0">
              <i className="bi bi-phone"></i>
              <h4>Call:</h4>
              <p>0345669006</p>
            </div>
          </div>
        </div>
      </div>
      <div className="map">
        <iframe
          style={{ border: 0, width: "100%", height: "350px" }}
          src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d786.0147882859981!2d106.16421642030677!3d20.426652417656122!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjDCsDI1JzM2LjgiTiAxMDbCsDA5JzUzLjAiRQ!5e0!3m2!1svi!2s!4v1713898005528!5m2!1svi!2s"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>
    </section>
  );
}
