import React from "react";
import { fetchPricing } from "@/data/constants";
import PricingSliderClient from "@/components/PricingSliderClient";
import type { Package } from "@/types";

type AdminPricingItem = {
  id: string;
  code: string;
  title: string;
  price: number;
  currency: string;
  tagline?: string | null;
  imageMediaId?: string;
  image?: string;
  bullets?: string[];
  displayOrder: number;
  isActive: boolean;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

function formatPrice(value: number) {
  return Number.isFinite(value) ? value.toLocaleString("vi-VN") : "0";
}

async function fetchAdminPricingPackages(): Promise<Package[]> {
  const response = await fetch(`${API_BASE_URL}/api/admin/pricing`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Cannot load admin pricing: ${response.status}`);
  }

  const items = (await response.json()) as AdminPricingItem[];

  return (items || [])
    .filter((item) => item.isActive)
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((item) => ({
      id: item.code || item.id,
      title: item.title,
      price: formatPrice(item.price),
      currency: item.currency,
      image: item.image || "",
      tagline: item.tagline || "",
      bullets: item.bullets || [],
    }));
}

export default async function PricingSection() {
  let packages: Package[] = [];

  try {
    packages = await fetchAdminPricingPackages();
  } catch {
    packages = await fetchPricing();
  }

  return (
    <section id="BaoGiaDichVu" className="events">
      <div className="container">
        <div className="section-title">
          <h2>
            Báo Giá Dịch Vụ <span>MeoDecor</span>
          </h2>
        </div>

        <div className="mt-6">
          <PricingSliderClient items={packages} />
        </div>
      </div>
    </section>
  );
}
