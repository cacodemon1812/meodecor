import React from "react";

export default function PricingSection() {
  return (
    <section id="BaoGiaDichVu" className="events">
      <div className="container">
        <div className="section-title">
          <h2>Báo Giá Dịch Vụ <span>MeoDecor</span></h2>
        </div>

        <div className="events-slider swiper">
          <div className="swiper-wrapper">
            {/* slide items copied from original HTML */}
            <div className="swiper-slide">
              <div className="row event-item">
                <div className="col-lg-6">
                  <img
                    src="/assets/img/maubetrai/24.jpg"
                    className="img-fluid"
                    alt=""
                  />
                </div>
                <div className="col-lg-6 pt-4 pt-lg-0 content">
                  <h3>Gói Mini</h3>
                  <div className="price">
                    <p><span>$1.399.000</span></p>
                  </div>
                  <p className="fst-italic">Thích hợp không gian nhỏ.</p>
                  <ul>
                    <li><i className="bi bi-check-circle"></i>Biển tên.</li>
                    <li><i className="bi bi-check-circle"></i>Chibi ảnh bé.</li>
                    <li><i className="bi bi-check-circle"></i>Sét đồ phụ kiện.</li>
                  </ul>
                </div>
              </div>
            </div>
            {/* additional slides omitted for brevity - can be added similarly */}
          </div>
          <div className="swiper-pagination"></div>
        </div>
      </div>
    </section>
  );
}
