export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
}

export interface CartItem {
  productId: number;
  quantity: number;
  product?: Product;
  totalPrice?: number;
}



const BASE_URL = 'http://localhost:3000';

export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const response = await fetch(`${BASE_URL}/api/products/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json() as Product[];
  } catch (error) {
    console.error(`Fehler beim Suchen nach "${query}":`, error);
    return [];
  }
}

export async function addToCart(userId: string, productId: number, quantity: number): Promise<void> {
  try {
    const response = await fetch(`${BASE_URL}/api/users/${userId}/cart/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, quantity }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json() as { message: string };
    console.log(`✓ ${result.message}`);
  } catch (error) {
    console.error(`Fehler beim Hinzufügen von Produkt ${productId}:`, error);
  }
}

export async function getCart(userId: string): Promise<CartItem[]> {
  try {
    const response = await fetch(`${BASE_URL}/api/users/${userId}/cart`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json() as CartItem[];
  } catch (error) {
    console.error('Fehler beim Abrufen des Warenkorbs:', error);
    return [];
  }
}