export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  images: string[];
  ingredients?: string;
  stock?: number; // New field
  sizes?: string[]; // New field
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string; // New field to track selected size in cart
}

export interface StoreSettings {
  name: string;
  logoUrl?: string;
  // Banner Settings
  heroImage?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroButtonText?: string;
  heroLink?: string; // Can be an anchor (#product-grid) or URL (https://wa.me/...)
}