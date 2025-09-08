interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
}

interface CartItem {
  productId: number;
  quantity: number;
  product?: Product;
  totalPrice?: number;
}

const BASE_URL = 'http://localhost:3000';
const CART_ID = 'omelette-cart-123';

const omeletteIngredients = [
  'Eier', 'Butter', 'Milch', 'Käse', 'Schinken', 
  'Pilze', 'Zwiebeln', 'Paprika', 'Schnittlauch', 
  'Salz', 'Pfeffer'
];

async function searchProducts(query: string): Promise<Product[]> {
  try {
    const response = await fetch(`${BASE_URL}/api/products/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Fehler beim Suchen nach "${query}":`, error);
    return [];
  }
}

async function addToCart(cartId: string, productId: number, quantity: number): Promise<void> {
  try {
    const response = await fetch(`${BASE_URL}/api/cart/${cartId}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, quantity }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log(`✓ ${result.message}`);
  } catch (error) {
    console.error(`Fehler beim Hinzufügen von Produkt ${productId}:`, error);
  }
}

async function getCart(cartId: string): Promise<CartItem[]> {
  try {
    const response = await fetch(`${BASE_URL}/api/cart/${cartId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Fehler beim Abrufen des Warenkorbs:', error);
    return [];
  }
}

async function testOmeletteWorkflow(): Promise<void> {
  console.log('🍳 Starte Omelette-Einkauf Workflow...\n');
  
  console.log('📝 Suche nach Omelette-Zutaten:');
  const foundProducts: Product[] = [];
  
  for (const ingredient of omeletteIngredients) {
    console.log(`   Suche nach: ${ingredient}`);
    const products = await searchProducts(ingredient);
    const matchingProduct = products.find(p => 
      p.name.toLowerCase().includes(ingredient.toLowerCase())
    );
    
    if (matchingProduct) {
      foundProducts.push(matchingProduct);
      console.log(`   ✓ Gefunden: ${matchingProduct.name} (CHF ${matchingProduct.price})`);
    } else {
      console.log(`   ✗ Nicht gefunden: ${ingredient}`);
    }
  }
  
  console.log(`\n🛒 Füge ${foundProducts.length} Produkte zum Warenkorb hinzu:`);
  
  for (const product of foundProducts) {
    await addToCart(CART_ID, product.id, 1);
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n📋 Warenkorb Inhalt:');
  const cart = await getCart(CART_ID);
  
  if (cart.length === 0) {
    console.log('   Warenkorb ist leer');
    return;
  }
  
  let totalCost = 0;
  cart.forEach((item, index) => {
    const price = item.totalPrice || 0;
    totalCost += price;
    console.log(`   ${index + 1}. ${item.product?.name} x${item.quantity} - CHF ${price.toFixed(2)}`);
  });
  
  console.log(`\n💰 Gesamtkosten: CHF ${totalCost.toFixed(2)}`);
  console.log('\n✅ Omelette-Einkauf abgeschlossen!');
}

if (require.main === module) {
  testOmeletteWorkflow().catch(console.error);
}