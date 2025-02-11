'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Chatbot } from '@/components/chat/Chatbot';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-white">
        {children}
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
} 