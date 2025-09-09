import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { addToCart, getCart, searchProducts } from "../cart-api-client";

export async function registerStoreApiTools(server: McpServer) {
  server.tool(
    "searchProducts",
    "Search for products in the store",
    {
      query: z.string().describe("Search query for products"),
    },
    async (args) => {
      const products = await searchProducts(args.query);
      return {
        content: [
          {
            text: JSON.stringify(products, null, 2),
            type: "text",
          },
        ],
      };
    },
  );

  server.tool(
    "addToCart",
    "Add a product to user's cart",
    {
      userId: z.string().describe("User ID"),
      productId: z.number().describe("Product ID to add to cart"),
      quantity: z.number().describe("Quantity to add"),
    },
    async (args) => {
      await addToCart(args.userId, args.productId, args.quantity);
      return {
        content: [
          {
            text: `Successfully added ${args.quantity} of product ${args.productId} to cart of user ${args.userId}}`,
            type: "text",
          },
        ],
      };
    },
  );

  server.tool(
    "getCart",
    "Get user's cart contents",
    {
      userId: z.string().describe("User ID"),
    },
    async (args) => {
      const cartItems = await getCart(args.userId);
      return {
        content: [
          {
            text: JSON.stringify(cartItems, null, 2),
            type: "text",
          },
        ],
      };
    },
  );
}
