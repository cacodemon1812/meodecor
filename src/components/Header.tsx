import React from "react";
import Link from "next/link";
import { fetchNavLinks, fetchCtaButtons } from "@/data/constants";
import HeaderClient from "./HeaderClient";

export default async function Header() {
  const NAV_LINKS = await fetchNavLinks();
  const CTA_BUTTONS = await fetchCtaButtons();

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
            {NAV_LINKS.map((link: any) => (
              <li key={link.id}>
                <a className="nav-link scrollto" href={link.href}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <i className="bi bi-list mobile-nav-toggle"></i>
        </nav>
        {/* .navbar */}

        <a
          href={CTA_BUTTONS.booking.href}
          className="book-a-table-btn scrollto"
        >
          {CTA_BUTTONS.booking.label}
        </a>
      </div>
      <HeaderClient />
    </header>
  );
}
