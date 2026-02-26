import React from "react";
import Link from "next/link";
import { NAV_LINKS, CTA_BUTTONS } from "@/data/constants";

export default function Header() {
  return (
    <header
      id="header"
      className="fixed-top d-flex align-items-center header-transparent"
    >
      <div className="container-fluid container-xl d-flex align-items-center justify-content-between">
        <img className="logo me-auto" />
        <h1>
          <Link href="/">MeoDecor</Link>
        </h1>

        <nav id="navbar" className="navbar order-last order-lg-0">
          <ul>
            <li>
              <a className="nav-link scrollto active" href="#hero">
                Trang Chủ
              </a>
            </li>
            <li>
              <a className="nav-link scrollto" href="#maubegai">
                Mẫu cho bé trai
              </a>
            </li>
            <li>
              <a className="nav-link scrollto" href="#maubetrai">
                Mẫu cho bé gái
              </a>
            </li>
            <li>
              <a className="nav-link scrollto" href="#mausangsinmin">
                Mẫu sang xịn mịn
              </a>
            </li>
            <li>
              <a className="nav-link scrollto" href="#contact">
                Liên hệ
              </a>
            </li>
          </ul>
          <i className="bi bi-list mobile-nav-toggle"></i>
        </nav>
        {/* .navbar */}

        <a href="#BaoGiaDichVu" className="book-a-table-btn scrollto">
          Đặt hàng
        </a>
      </div>
    </header>
  );
}
