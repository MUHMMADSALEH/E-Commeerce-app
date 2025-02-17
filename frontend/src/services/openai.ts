import axios from 'axios';
import { Product } from '@/data/mockProducts';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

interface ChatContext {
  userPreferences?: {
    recentViews?: string[];
    purchaseHistory?: string[];
    interests?: string[];
  };
  availableProducts?: Product[];
}

export class ChatService {
  private apiKey: string;
  private conversationHistory: Array<{ role: string; content: string }> = [];

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private formatProductDetails(products: Product[]) {
    return products.map(p => ({
      id: p._id,
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.category,
      specifications: this.extractSpecifications(p.description),
      stock: p.stock,
      rating: p.rating
    }));
  }

  private extractSpecifications(description: string) {
    // Extract key specifications from product description
    const specs = description.split('.').map(s => s.trim()).filter(Boolean);
    return specs;
  }

  async sendMessage(message: string, context: { products?: Product[]; userPreferences?: any } = {}) {
    try {
      const formattedProducts = context.products ? this.formatProductDetails(context.products) : [];
      
      // Create a detailed system message with product context and instructions
      const systemMessage = `You are an expert e-commerce shopping assistant. Your role is to help customers find the perfect products and provide detailed information about them.

Key Responsibilities:
1. Provide detailed product recommendations based on user queries and preferences
2. Answer specific questions about product features, specifications, and capabilities
3. Compare products when relevant
4. Maintain a helpful and knowledgeable tone
5. Consider user preferences and history: ${JSON.stringify(context.userPreferences || {})}

Available Products Information:
${JSON.stringify(formattedProducts, null, 2)}

Guidelines for Responses:
1. When recommending products, always include:
   - Product name and price
   - Key specifications and features
   - Stock availability
   - Rating information
2. Use [PRODUCTS] tag followed by product IDs when recommending specific products
3. For technical products (like laptops, electronics), focus on specifications
4. For lifestyle products, emphasize features and benefits
5. If a user asks about a specific category, provide relevant options from that category
6. Compare products when users ask about multiple options

Example Response Format:
"Based on your requirements, here are some recommendations:

1. [Product Name] - $[Price]
   - Key Features: [List key features]
   - Current Rating: [Rating]/5
   - Stock Status: [In Stock/Limited Stock/Out of Stock]
   [PRODUCTS]product_id[/PRODUCTS]"`;

      // Add the new message to conversation history
      this.conversationHistory.push({ role: 'user', content: message });

      const response = await axios.post(
        OPENAI_API_URL,
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemMessage },
            ...this.conversationHistory.slice(-5)
          ],
          temperature: 0.7,
          max_tokens: 500
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const botResponse = response.data.choices[0].message.content;
      this.conversationHistory.push({ role: 'assistant', content: botResponse });

      return botResponse;
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      throw new Error('Failed to get response from AI');
    }
  }

  clearConversation() {
    this.conversationHistory = [];
  }
} 