

export type RateItem = {
  id: string;
  service: string;
  price: string;
  items: string[];
  sortOrder: number;
};


export type Service = {
  id: string;
  icon: string;
  title: string;
  description: string;
  sortOrder: number;
};

export type Rate = {
  id: string;
  icon: string;
  title: string;
  price: string;
  items: string[];
  ctaLabel: string;
  ctaMessage: string;
  sortOrder: number;
};

export type PortfolioItem = {
  id: string;
  title: string;
  caption?: string | null;
  category: string;
  imageUrl: string;
  sortOrder: number;
};

export type BookingPayload = {
  name: string;
  phone: string;
  service: string;
  date: string;
  message?: string;
  referral?: string;
};