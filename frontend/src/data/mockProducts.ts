export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  rating: number;
}

export const mockProducts: Product[] = [
  {
    _id: '65f1c1d86d65f3c8e815d1a1',
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and superior sound quality.',
    price: 299.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format',
    stock: 50,
    rating: 4.5
  },
  {
    _id: '65f1c1d86d65f3c8e815d1a2',
    name: 'Smart Fitness Watch',
    description: 'Advanced fitness tracker with heart rate monitoring, GPS, and sleep tracking capabilities.',
    price: 199.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&auto=format',
    stock: 75,
    rating: 4.3
  },
  {
    _id: '65f1c1d86d65f3c8e815d1a3',
    name: 'Premium Coffee Maker',
    description: 'Programmable coffee maker with built-in grinder and thermal carafe. Makes up to 12 cups.',
    price: 149.99,
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1520970014086-2208d157c9e2?w=500&auto=format',
    stock: 30,
    rating: 4.7
  },
  {
    _id: '65f1c1d86d65f3c8e815d1a4',
    name: 'Ergonomic Office Chair',
    description: 'Adjustable office chair with lumbar support, breathable mesh back, and premium cushioning.',
    price: 249.99,
    category: 'Furniture',
    image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=500&auto=format',
    stock: 25,
    rating: 4.6
  },
  {
    _id: '65f1c1d86d65f3c8e815d1a5',
    name: 'Professional DSLR Camera',
    description: '24.1MP digital camera with 4K video capability, Wi-Fi connectivity, and advanced autofocus.',
    price: 899.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format',
    stock: 15,
    rating: 4.8
  },
  {
    _id: '65f1c1d86d65f3c8e815d1a6',
    name: 'Stainless Steel Cookware Set',
    description: '10-piece cookware set including pots, pans, and lids. Dishwasher safe and induction compatible.',
    price: 199.99,
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1584990347449-b7abea3e5a5f?w=500&auto=format',
    stock: 40,
    rating: 4.4
  },
  {
    _id: '65f1c1d86d65f3c8e815d1a7',
    name: 'Smart LED TV - 55"',
    description: '4K Ultra HD Smart TV with HDR, built-in streaming apps, and voice control.',
    price: 699.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&auto=format',
    stock: 20,
    rating: 4.6
  },
  {
    _id: '65f1c1d86d65f3c8e815d1a8',
    name: 'Robot Vacuum Cleaner',
    description: 'Smart robot vacuum with mapping technology, app control, and automatic charging.',
    price: 299.99,
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1589006833659-fd23b3210877?w=500&auto=format',
    stock: 35,
    rating: 4.2
  },
  {
    _id: '65f1c1d86d65f3c8e815d1a9',
    name: 'Gaming Laptop',
    description: '15.6" gaming laptop with RTX 3060, 16GB RAM, 512GB SSD, and high refresh rate display.',
    price: 1299.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&auto=format',
    stock: 10,
    rating: 4.7
  },
  {
    _id: '65f1c1d86d65f3c8e815d1aa',
    name: 'Air Purifier',
    description: 'HEPA air purifier with UV-C light, perfect for rooms up to 500 sq ft. Removes 99.9% of airborne particles.',
    price: 179.99,
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1605794485736-ea0d0bd1e147?w=500&auto=format',
    stock: 45,
    rating: 4.5
  }
]; 