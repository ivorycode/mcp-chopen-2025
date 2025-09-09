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

let shoppingCarts: { [userId: string]: { [cartId: string]: Array<{ productId: number; quantity: number }> } } = {};

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

app.post('/api/users/:userId/cart/:cartId/items', (req, res) => {
  const userId = req.params.userId;
  const cartId = req.params.cartId;
  const { productId, quantity } = req.body;
  
  console.log(`🛒 [CART] Add item request: userId="${userId}", cartId="${cartId}", productId=${productId}, quantity=${quantity}`);
  
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
    shoppingCarts[userId] = {};
    console.log(`🆕 [CART] Created new user cart storage for userId="${userId}"`);
  }
  
  if (!shoppingCarts[userId][cartId]) {
    shoppingCarts[userId][cartId] = [];
    console.log(`🆕 [CART] Created new cart "${cartId}" for user "${userId}"`);
  }
  
  const existingItem = shoppingCarts[userId][cartId].find(item => item.productId === productId);
  
  if (existingItem) {
    const oldQuantity = existingItem.quantity;
    existingItem.quantity += quantity;
    console.log(`🔄 [CART] Updated existing item: "${product.name}" quantity ${oldQuantity} -> ${existingItem.quantity}`);
  } else {
    shoppingCarts[userId][cartId].push({ productId, quantity });
    console.log(`➕ [CART] Added new item: "${product.name}" x${quantity}`);
  }
  
  const totalItems = shoppingCarts[userId][cartId].length;
  console.log(`✅ [CART] Cart "${cartId}" now has ${totalItems} different items`);
  
  res.json({ message: 'Artikel zum Warenkorb hinzugefügt', cart: shoppingCarts[userId][cartId] });
});

app.get('/api/users/:userId/cart/:cartId', (req, res) => {
  const userId = req.params.userId;
  const cartId = req.params.cartId;
  
  console.log(`📋 [CART] Get cart request: userId="${userId}", cartId="${cartId}"`);
  
  const cart = (shoppingCarts[userId] && shoppingCarts[userId][cartId]) || [];
  
  if (cart.length === 0) {
    console.log(`🛒 [CART] Empty cart for userId="${userId}", cartId="${cartId}"`);
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

app.listen(PORT, () => {
  console.log(`Store API läuft auf Port ${PORT}`);
});