export type Package = {
  id: string;
  title: string;
  price: string;
  currency?: string;
  image?: string;
  tagline?: string;
  bullets?: string[];
};

export type NavLink = {
  label: string;
  href: string;
  id: string;
};

export type HeroSlide = {
  id: number;

  title: string;
  subtitle: string;
  description: string;
};
export type HeroSlideBg = {
  id: number;
  image: string;
};

export type EventItem = {
  id: string;
  title: string;
  cover: string;
  images: string[];
  description: string;
};
