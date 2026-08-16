export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  description: string;
  category: string;
  specs: { label: string; value: string }[];
  stock: number;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  customer: {
    name: string;
    phone: string;
    address: string;
    email: string;
  };
  shippingFee: number;
  total: number;
  paymentMethod: "vnpay" | "momo" | "cod";
  status: "pending" | "paid" | "shipped" | "completed" | "cancelled";
  createdAt: string;
}
