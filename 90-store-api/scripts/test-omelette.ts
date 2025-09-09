import {addToCart, getCart, type Product, searchProducts} from '../src/cart-api-client';


const USER_ID = 'test-user-123';

const omeletteIngredients = [
  'Eier', 'Butter', 'Milch', 'Käse', 'Schinken', 
  'Pilze', 'Zwiebeln', 'Paprika', 'Schnittlauch', 
  'Salz', 'Pfeffer'
];


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
    await addToCart(USER_ID, product.id, 1);
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n📋 Warenkorb Inhalt:');
  const cart = await getCart(USER_ID);
  
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