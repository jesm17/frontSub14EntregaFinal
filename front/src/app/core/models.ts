export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Game {
  _id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  isOffer: boolean;
  isOutstanding: boolean;
  platforms: string[];
  description: string;
}
