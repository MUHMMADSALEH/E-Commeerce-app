import { Product } from '@/data/mockProducts';
import { ChatService } from './openai';

export interface UserPreferences {
  recentViews: string[];
  purchaseHistory: string[];
  interests: string[];
  favoriteCategories: string[];
}

class RecommendationService {
  private chatService: ChatService;

  constructor() {
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';
    this.chatService = new ChatService(apiKey);
  }

  async getPersonalizedRecommendations(
    products: Product[],
    userPreferences: Partial<UserPreferences>
  ): Promise<Product[]> {
    try {
      // Create a prompt for the AI to generate recommendations
      const prompt = `Based on the following user preferences:
      - Recently viewed: ${userPreferences.recentViews?.join(', ')}
      - Purchase history: ${userPreferences.purchaseHistory?.join(', ')}
      - Interests: ${userPreferences.interests?.join(', ')}
      - Favorite categories: ${userPreferences.favoriteCategories?.join(', ')}

      Please recommend 5 products from the available catalog that this user might be interested in.
      Return only the product IDs in a comma-separated format.`;

      // Get AI recommendations
      const response = await this.chatService.sendMessage(prompt, {
        products,
        userPreferences
      });

      // Extract product IDs from the response
      const recommendedIds = response
        .match(/\b[0-9a-f]{24}\b/g) // Match MongoDB ObjectIDs
        ?.slice(0, 5) || [];

      // Filter products based on recommended IDs
      const recommendedProducts = products.filter(product =>
        recommendedIds.includes(product._id)
      );

      return recommendedProducts;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      // Fallback to random products if AI fails
      return products
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);
    }
  }

  async getSimilarProducts(
    product: Product,
    products: Product[],
    limit: number = 4
  ): Promise<Product[]> {
    try {
      const prompt = `Given this product:
      Name: ${product.name}
      Category: ${product.category}
      Description: ${product.description}
      Price: ${product.price}

      Please recommend ${limit} similar products from the available catalog that customers might also like.
      Return only the product IDs in a comma-separated format.`;

      const response = await this.chatService.sendMessage(prompt, { products });

      const recommendedIds = response
        .match(/\b[0-9a-f]{24}\b/g)
        ?.slice(0, limit) || [];

      return products.filter(p => 
        recommendedIds.includes(p._id) && p._id !== product._id
      );
    } catch (error) {
      console.error('Error getting similar products:', error);
      // Fallback to same category products
      return products
        .filter(p => p.category === product.category && p._id !== product._id)
        .sort(() => Math.random() - 0.5)
        .slice(0, limit);
    }
  }
}

export const recommendationService = new RecommendationService(); 