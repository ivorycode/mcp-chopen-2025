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

let shoppingCarts: { [cartId: string]: Array<{ productId: number; quantity: number }> } = {};

app.get('/api/products/search', (req, res) => {
  const query = req.query.q as string;
  
  if (!query) {
    return res.json(groceryProducts);
  }
  
  const filteredProducts = groceryProducts.filter(product =>
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.category.toLowerCase().includes(query.toLowerCase())
  );
  
  res.json(filteredProducts);
});

app.post('/api/cart/:cartId/items', (req, res) => {
  const cartId = req.params.cartId;
  const { productId, quantity } = req.body;
  
  if (!productId || !quantity || quantity <= 0) {
    return res.status(400).json({ error: 'ProductId und quantity sind erforderlich' });
  }
  
  const product = groceryProducts.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ error: 'Produkt nicht gefunden' });
  }
  
  if (!shoppingCarts[cartId]) {
    shoppingCarts[cartId] = [];
  }
  
  const existingItem = shoppingCarts[cartId].find(item => item.productId === productId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    shoppingCarts[cartId].push({ productId, quantity });
  }
  
  res.json({ message: 'Artikel zum Warenkorb hinzugefügt', cart: shoppingCarts[cartId] });
});

app.get('/api/cart/:cartId', (req, res) => {
  const cartId = req.params.cartId;
  const cart = shoppingCarts[cartId] || [];
  
  const cartWithProducts = cart.map(item => {
    const product = groceryProducts.find(p => p.id === item.productId);
    return {
      ...item,
      product,
      totalPrice: product ? product.price * item.quantity : 0
    };
  });
  
  res.json(cartWithProducts);
});

app.listen(PORT, () => {
  console.log(`Store API läuft auf Port ${PORT}`);
});