export interface ProductColor {
  name: string;
  hex: string;
  image_index: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: "sunglasses" | "optical" | "bluelight";
  description: string;
  material: string;
  sizes: string[];
  colors: ProductColor[];
  images: string[];
  is_bestseller: boolean;
  created_at: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  color: string;
  quantity: number;
  created_at: string;
  products?: Product;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  color: string;
  quantity: number;
  price: number;
  products?: Pick<Product, "name" | "images">;
}

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_zip_code: string;
  shipping_memo?: string;
  payment_method: string;
  total_amount: number;
  status: "pending" | "confirmed" | "shipping" | "delivered";
  created_at: string;
  order_items?: OrderItem[];
}

export interface Profile {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  zip_code?: string;
  created_at: string;
}
