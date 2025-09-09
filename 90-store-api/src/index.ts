import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const groceryProducts = [
  // Omelette ingredients
  { id: 1000000001, name: 'Eier', category: 'Molkerei', price: 3.49 },
  { id: 1000000002, name: 'Butter', category: 'Molkerei', price: 2.99 },
  { id: 1000000003, name: 'Milch', category: 'Molkerei', price: 1.29 },
  { id: 1000000004, name: 'Käse', category: 'Molkerei', price: 4.99 },
  { id: 1000000005, name: 'Schinken', category: 'Fleisch', price: 5.99 },
  { id: 1000000006, name: 'Pilze', category: 'Gemüse', price: 2.89 },
  { id: 1000000007, name: 'Zwiebeln', category: 'Gemüse', price: 1.99 },
  { id: 1000000008, name: 'Paprika', category: 'Gemüse', price: 2.49 },
  { id: 1000000009, name: 'Schnittlauch', category: 'Kräuter', price: 1.49 },
  { id: 1000000010, name: 'Salz', category: 'Gewürze', price: 0.89 },
  { id: 1000000011, name: 'Pfeffer', category: 'Gewürze', price: 1.29 },

  // Spaghetti ingredients
  { id: 2000000001, name: 'Spaghetti', category: 'Teigwaren', price: 1.49 },
  { id: 2000000002, name: 'Hackfleisch', category: 'Fleisch', price: 7.99 },
  { id: 2000000003, name: 'Tomaten gehackt', category: 'Konserven', price: 1.89 },
  { id: 2000000004, name: 'Tomatenmark', category: 'Konserven', price: 1.49 },
  { id: 2000000005, name: 'Parmesan', category: 'Molkerei', price: 6.99 },
  { id: 2000000006, name: 'Knoblauch', category: 'Gemüse', price: 2.29 },
  { id: 2000000007, name: 'Basilikum', category: 'Kräuter', price: 1.99 },
  { id: 2000000008, name: 'Olivenöl', category: 'Öle & Essig', price: 4.99 },
  { id: 2000000009, name: 'Rotwein', category: 'Alkohol', price: 8.99 },
  { id: 2000000010, name: 'Oregano', category: 'Gewürze', price: 1.79 },

  // Riz Casimir ingredients
  { id: 3000000001, name: 'Reis', category: 'Getreide', price: 2.19 },
  { id: 3000000002, name: 'Pouletbrust', category: 'Fleisch', price: 12.99 },
  { id: 3000000003, name: 'Ananas', category: 'Obst', price: 2.99 },
  { id: 3000000004, name: 'Curry Pulver', category: 'Gewürze', price: 2.49 },
  { id: 3000000005, name: 'Kokosmilch', category: 'Konserven', price: 1.99 },
  { id: 3000000006, name: 'Rosinen', category: 'Trockenfrüchte', price: 3.49 },
  { id: 3000000007, name: 'Mandeln gehackt', category: 'Nüsse', price: 4.99 },
  { id: 3000000008, name: 'Bananen', category: 'Obst', price: 1.89 },
  { id: 3000000009, name: 'Ingwer', category: 'Gewürze', price: 2.99 },
  { id: 3000000010, name: 'Zitrone', category: 'Obst', price: 0.99 },

  // Additional common ingredients
  { id: 4000000001, name: 'Äpfel', category: 'Obst', price: 2.99 },
  { id: 4000000002, name: 'Brot', category: 'Backwaren', price: 2.49 },
  { id: 4000000003, name: 'Joghurt', category: 'Molkerei', price: 0.89 },
  { id: 4000000004, name: 'Tomaten', category: 'Gemüse', price: 3.29 },
  { id: 4000000005, name: 'Karotten', category: 'Gemüse', price: 1.99 },
  { id: 4000000006, name: 'Gurken', category: 'Gemüse', price: 1.49 },
  { id: 4000000007, name: 'Salat', category: 'Gemüse', price: 1.79 }
];

let shoppingCarts: { [userId: string]: { items: Array<{ productId: number; quantity: number }>; submitted: boolean } } = {};

app.get('/api/products/search', (req, res) => {
  const query = req.query.q as string;
  
  console.log(`🔍 [PRODUCTS] Search request: query="${query || 'all products'}"`);
  
  if (!query) {
    console.log(`📦 [PRODUCTS] Returning all ${groceryProducts.length} products`);
    return res.json(groceryProducts);
  }
  
  const filteredProducts = groceryProducts.filter(product =>
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.category.toLowerCase().includes(query.toLowerCase())
  );
  
  console.log(`📦 [PRODUCTS] Found ${filteredProducts.length} products matching "${query}"`);
  res.json(filteredProducts);
});

app.post('/api/users/:userId/cart/items', (req, res) => {
  const userId = req.params.userId;
  const { productId, quantity } = req.body;
  
  console.log(`🛒 [CART] Add item request: userId="${userId}", productId=${productId}, quantity=${quantity}`);
  
  if (!productId || !quantity || quantity <= 0) {
    console.log(`❌ [CART] Invalid request: missing or invalid productId/quantity`);
    return res.status(400).json({ error: 'ProductId und quantity sind erforderlich' });
  }
  
  const product = groceryProducts.find(p => p.id === productId);
  if (!product) {
    console.log(`❌ [CART] Product not found: productId=${productId}`);
    return res.status(404).json({ error: 'Produkt nicht gefunden' });
  }
  
  console.log(`📝 [CART] Product found: "${product.name}" (CHF ${product.price})`);
  
  if (!shoppingCarts[userId]) {
    shoppingCarts[userId] = { items: [], submitted: false };
    console.log(`🆕 [CART] Created new cart for userId="${userId}"`);
  }
  
  const existingItem = shoppingCarts[userId].items.find(item => item.productId === productId);
  
  if (existingItem) {
    const oldQuantity = existingItem.quantity;
    existingItem.quantity += quantity;
    console.log(`🔄 [CART] Updated existing item: "${product.name}" quantity ${oldQuantity} -> ${existingItem.quantity}`);
  } else {
    shoppingCarts[userId].items.push({ productId, quantity });
    console.log(`➕ [CART] Added new item: "${product.name}" x${quantity}`);
  }
  
  const totalItems = shoppingCarts[userId].items.length;
  console.log(`✅ [CART] Cart now has ${totalItems} different items`);
  
  res.json({ message: 'Artikel zum Warenkorb hinzugefügt', cart: shoppingCarts[userId].items });
});

app.get('/api/users/:userId/cart', (req, res) => {
  const userId = req.params.userId;
  
  console.log(`📋 [CART] Get cart request: userId="${userId}"`);
  
  const cart = shoppingCarts[userId]?.items || [];
  
  if (cart.length === 0) {
    console.log(`🛒 [CART] Empty cart for userId="${userId}"`);
  } else {
    console.log(`🛒 [CART] Found ${cart.length} items in cart`);
  }
  
  const cartWithProducts = cart.map(item => {
    const product = groceryProducts.find(p => p.id === item.productId);
    const totalPrice = product ? product.price * item.quantity : 0;
    console.log(`📦 [CART] Item: "${product?.name || 'Unknown'}" x${item.quantity} = CHF ${totalPrice.toFixed(2)}`);
    return {
      ...item,
      product,
      totalPrice
    };
  });
  
  const totalCartValue = cartWithProducts.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  console.log(`💰 [CART] Total cart value: CHF ${totalCartValue.toFixed(2)}`);
  
  res.json(cartWithProducts);
});

app.post('/api/users/:userId/cart/submit', (req, res) => {
  const userId = req.params.userId;
  
  console.log(`📮 [SUBMIT] Submit cart request: userId="${userId}"`);
  
  if (!shoppingCarts[userId] || shoppingCarts[userId].items.length === 0) {
    console.log(`❌ [SUBMIT] Cannot submit empty cart for userId="${userId}"`);
    return res.status(400).json({ error: 'Warenkorb ist leer und kann nicht abgeschickt werden' });
  }
  
  if (shoppingCarts[userId].submitted) {
    console.log(`❌ [SUBMIT] Cart already submitted for userId="${userId}"`);
    return res.status(400).json({ error: 'Warenkorb wurde bereits abgeschickt' });
  }
  
  const cart = shoppingCarts[userId].items;
  const cartWithProducts = cart.map(item => {
    const product = groceryProducts.find(p => p.id === item.productId);
    const totalPrice = product ? product.price * item.quantity : 0;
    return {
      ...item,
      product,
      totalPrice
    };
  });
  
  const totalCartValue = cartWithProducts.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  
  shoppingCarts[userId].submitted = true;
  
  console.log(`✅ [SUBMIT] Cart submitted successfully!`);
  console.log(`📋 [SUBMIT] Items in submitted cart:`);
  cartWithProducts.forEach((item, index) => {
    console.log(`   ${index + 1}. "${item.product?.name || 'Unknown'}" x${item.quantity} = CHF ${item.totalPrice?.toFixed(2) || '0.00'}`);
  });
  console.log(`💰 [SUBMIT] Total submitted value: CHF ${totalCartValue.toFixed(2)}`);
  
  res.json({ 
    message: 'Warenkorb erfolgreich abgeschickt', 
    submittedItems: cartWithProducts.length,
    totalValue: totalCartValue 
  });
});

app.get('/api/carts/summary', (req, res) => {
  console.log(`📊 [SUMMARY] Get all carts summary request`);
  
  const summaries = Object.entries(shoppingCarts).map(([userId, cartData]) => {
    const cartWithProducts = cartData.items.map(item => {
      const product = groceryProducts.find(p => p.id === item.productId);
      const totalPrice = product ? product.price * item.quantity : 0;
      return {
        ...item,
        product,
        totalPrice
      };
    });
    
    const totalValue = cartWithProducts.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
    const productCount = cartData.items.reduce((sum, item) => sum + item.quantity, 0);
    
    return {
      userId,
      totalValue,
      productCount,
      submitted: cartData.submitted
    };
  });
  
  console.log(`📊 [SUMMARY] Found ${summaries.length} carts total`);
  summaries.forEach((summary, index) => {
    const status = summary.submitted ? 'SUBMITTED' : 'PENDING';
    console.log(`   ${index + 1}. User: "${summary.userId}" | ${summary.productCount} items | CHF ${summary.totalValue.toFixed(2)} | ${status}`);
  });
  
  res.json(summaries);
});

app.listen(PORT, () => {
  console.log(`Store API läuft auf Port ${PORT}`);
});