import { useState, useRef, useEffect } from 'react';
import { ChatService } from '@/services/openai';
import { Button } from '@/components/ui/Button';
import { useProducts } from '@/hooks/useProducts';
import { useAuth } from '@/contexts/AuthContext';
import { type Product } from '@/data/mockProducts';
import Link from 'next/link';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  products?: Product[];
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { products, isLoading: productsLoading } = useProducts();
  const { user } = useAuth();
  
  const chatService = new ChatService(process.env.NEXT_PUBLIC_OPENAI_API_KEY || '');

  // Add welcome message when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: `Hello${user ? ` ${user.name}` : ''}! 👋 I'm your personal shopping assistant. I can help you:
- Find products based on your specific requirements
- Provide detailed product information and specifications
- Compare different products
- Answer questions about features and capabilities
- Make personalized recommendations

How can I assist you today?`,
        isBot: true,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, user, messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading || productsLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Prepare context with user preferences and available products
      const context = {
        userPreferences: {
          recentViews: user?.recentViews || [],
          purchaseHistory: user?.purchaseHistory || [],
          interests: user?.interests || []
        },
        products
      };

      const response = await chatService.sendMessage(inputMessage, context);
      
      // Parse product recommendations if any
      let productRecommendations: Product[] = [];
      if (response.includes('[PRODUCTS]')) {
        const productIds = response
          .match(/\[PRODUCTS\](.*?)\[\/PRODUCTS\]/s)?.[1]
          .split(',')
          .map(id => id.trim());
        
        if (productIds) {
          productRecommendations = products.filter(p => 
            productIds.includes(p._id)
          );
        }
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.replace(/\[PRODUCTS\].*?\[\/PRODUCTS\]/s, ''),
        isBot: true,
        timestamp: new Date(),
        products: productRecommendations
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Failed to get bot response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-indigo-600 text-white rounded-full p-4 shadow-lg hover:bg-indigo-700 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="bg-indigo-600 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
            <h3 className="font-medium">Shopping Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id}>
                <div
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.isBot
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-indigo-600 text-white'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    <p className="text-xs mt-1 opacity-75">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                
                {/* Product Recommendations */}
                {message.products && message.products.length > 0 && (
                  <div className="mt-2 space-y-2">
                    <p className="text-sm font-medium text-gray-600">Recommended Products:</p>
                    <div className="flex overflow-x-auto space-x-2 pb-2">
                      {message.products.map((product) => (
                        <Link
                          key={product._id}
                          href={`/products/${product._id}`}
                          className="flex-shrink-0 w-48 bg-white border rounded-lg p-2 hover:shadow-lg transition-shadow"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-32 object-cover rounded"
                          />
                          <div className="mt-2">
                            <h4 className="text-sm font-medium text-gray-900">{product.name}</h4>
                            <p className="text-sm font-bold text-gray-900 mt-1">
                              ${product.price.toFixed(2)}
                            </p>
                            <div className="flex items-center mt-1">
                              <div className="flex items-center">
                                <span className="text-yellow-400 mr-1">★</span>
                                <span className="text-sm text-gray-600">{product.rating}</span>
                              </div>
                              <span className="mx-2 text-gray-300">•</span>
                              <span className={`text-sm ${
                                product.stock > 10 ? 'text-green-600' :
                                product.stock > 0 ? 'text-yellow-600' :
                                'text-red-600'
                              }`}>
                                {product.stock > 10 ? 'In Stock' :
                                 product.stock > 0 ? `${product.stock} left` :
                                 'Out of Stock'}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="border-t p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={productsLoading ? "Loading products..." : "Ask about products or get recommendations..."}
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={isLoading || productsLoading}
              />
              <Button
                type="submit"
                disabled={isLoading || productsLoading || !inputMessage.trim()}
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
} 