export type ProductRating = {
  rate: number;
  count: number;
};

export interface Product {
  id: number;
  title: string;
  name: string;
  price: number;
  discountedPrice?: number;
  quantity: number;
  description: string;
  category: string;
  image: string;
  rating: ProductRating;
  discount?: boolean;
}

export interface OrderDetails {
  id: number;
  items: Product[];
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  total: number;
}

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export interface EssentialLinkProps {
  title: string;
  caption?: string;
  link?: string;
  icon?: string;
}
