import React from "react";

export default function TopBar() {
  return (
    <section
      id="topbar"
      className="d-flex align-items-center fixed-top topbar-transparent"
    >
      <div className="container-fluid container-xl d-flex align-items-center justify-content-center justify-content-lg-start">
        <i className="bi bi-phone d-flex align-items-center">
          <span>0345669006 </span>
        </i>
        <i className="bi bi-clock ms-4 d-none d-lg-flex align-items-center">
          <span>Số 68/75 Điện Biên - Cửa Bắc - Tp Nam Định.</span>
        </i>
      </div>
    </section>
  );
}
