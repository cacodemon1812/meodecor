import React from "react";

export default function EventsSection() {
  return (
    <section id="events" className="chefs">
      <div className="container">
        <div className="section-title">
          <h2>Sự Kiện <span>MeoDecor</span></h2>
        </div>

        <div className="row">
          <div className="col-lg-4 col-md-6">
            <div className="member">
              <div className="pic">
                <img src="/assets/img/meobaogia/gia1.jpg" className="img-fluid" alt="" />
              </div>
              <div className="member-info">
                <h4>TRANG TRÍ NGÀY LỄ, KỶ niỆM</h4>
                <div className="text-center">
                  <button className="meobuton">Xem thêm</button>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <div className="member">
              <div className="pic">
                <img src="/assets/img/meobaogia/gia2.jpg" className="img-fluid" alt="" />
              </div>
              <div className="member-info">
                <h4>TRANG TRÍ TẾT</h4>
                <div className="text-center">
                  <button className="meobuton">Xem thêm</button>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <div className="member">
              <div className="pic">
                <img src="/assets/img/meobaogia/gia4.jpg" className="img-fluid" alt="" />
              </div>
              <div className="member-info">
                <h4>TRANG TRÍ NOEL</h4>
                <div className="text-center">
                  <button className="meobuton">Xem thêm</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
