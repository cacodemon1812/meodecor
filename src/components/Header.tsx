import React from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchNavLinks, fetchCtaButtons, fetchTopbar } from "@/data/constants";
import type { NavLink } from "@/types";
import HeaderClient from "./HeaderClient";

export default async function Header() {
  const NAV_LINKS = await fetchNavLinks();
  const CTA_BUTTONS = await fetchCtaButtons();
  const TOPBAR_DATA = await fetchTopbar();

  return (
    <header
      id="header"
      className="fixed-top d-flex align-items-center header-transparent"
    >
      <div className="container-fluid container-xl d-flex align-items-center justify-content-between">
        <div className="brand-wrap d-flex align-items-center me-auto">
          <Link href="/" className="brand-logo d-flex align-items-center">
            <Image
              src="/assets/img/logo/logo.png"
              alt="MeoDecor Logo"
              width={44}
              height={44}
              className="brand-logo-img"
              priority
            />
          </Link>
          <div className="brand-meta ">
            <h1 className="brand-title mb-0 ">
              <Link href="/">MeoDecor</Link>
            </h1>
            <p className="brand-address mb-0">{TOPBAR_DATA.address}</p>
          </div>
        </div>

        <nav id="navbar" className="navbar order-last order-lg-0">
          <ul>
            {NAV_LINKS.map((link: NavLink) => (
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
