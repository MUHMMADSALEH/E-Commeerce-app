'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function OrderSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-lg mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>
        <Link href="/products">
          <Button variant="secondary">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
} 