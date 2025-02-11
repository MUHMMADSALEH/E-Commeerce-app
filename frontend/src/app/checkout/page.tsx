'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface ShippingDetails {
  fullName: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    fullName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // In a real app, you would send this data to your backend
      console.log('Order details:', { items, total, shippingDetails });
      
      // Clear cart and redirect to success page
      clearCart();
      router.push('/order-success');
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Button onClick={() => router.push('/products')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-10">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Shipping Details Form */}
        <div className="bg-white p-10 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-8">Shipping Details</h2>
          <form onSubmit={handleSubmit} className="space-y-8">
            <Input
              label="Full Name"
              value={shippingDetails.fullName}
              onChange={(e) => setShippingDetails(prev => ({ ...prev, fullName: e.target.value }))}
              required
              className="w-full text-lg py-2.5"
            />
            <Input
              label="Email"
              type="email"
              value={shippingDetails.email}
              onChange={(e) => setShippingDetails(prev => ({ ...prev, email: e.target.value }))}
              required
              className="w-full text-lg py-2.5"
            />
            <Input
              label="Address"
              value={shippingDetails.address}
              onChange={(e) => setShippingDetails(prev => ({ ...prev, address: e.target.value }))}
              required
              className="w-full text-lg py-2.5"
            />
            <Input
              label="City"
              value={shippingDetails.city}
              onChange={(e) => setShippingDetails(prev => ({ ...prev, city: e.target.value }))}
              required
              className="w-full text-lg py-2.5"
            />
            <Input
              label="ZIP Code"
              value={shippingDetails.zipCode}
              onChange={(e) => setShippingDetails(prev => ({ ...prev, zipCode: e.target.value }))}
              required
              className="w-full text-lg py-2.5"
            />
            <Button type="submit" disabled={isLoading} className="w-full text-lg py-3 mt-6">
              {isLoading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-10 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-8">Order Summary</h2>
          <div className="bg-gray-50 p-8 rounded-lg">
            {items.map((item) => (
              <div key={item.product._id} className="flex justify-between py-3 text-lg">
                <span>{item.product.name} x {item.quantity}</span>
                <span>${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t mt-6 pt-6">
              <div className="flex justify-between font-bold text-xl">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 