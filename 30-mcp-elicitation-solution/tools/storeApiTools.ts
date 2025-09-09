import {z} from "zod";
import type {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {addToCart, getCart, searchProducts, submitCart} from "./cart-api-client.ts";

export async function registerStoreApiTools(server: McpServer) {
  server.tool(
    "searchProducts",
    "Search for products in the store",
    {
      query: z.string().describe("Search query for products")
    },
    async (args) => {

      const products = await searchProducts(args.query);

      if (products.length > 0) {
        return {
          content: [
            {
              text: JSON.stringify(products, null, 2),
              type: "text"
            }
          ],
          structuredContent: {
            product: products[0],
            searchTerm: args.query
          }
        };
      } else {

        const clientCapabilities = server.server.getClientCapabilities();

        console.error("Client does not support sampling, skipping sampling request");
        return {
          content: [{type: "text", text: `No products found that are matching the term ${args.query}`}]
        };
        
      }
    }
  );

  server.tool(
    "addToCart",
    "Add a product to user's cart",
    {
      userId: z.string().describe("User ID"),
      productId: z.number().describe("Product ID to add to cart"),
      quantity: z.number().describe("Quantity to add")
    },
    async (args) => {
      await addToCart(args.userId, args.productId, args.quantity);
      return {
        content: [
          {
            text: `Successfully added ${args.quantity} of product ${args.productId} to cart of user ${args.userId}}`,
            type: "text"
          }
        ]
      };
    }
  );

  server.tool(
    "getCart",
    "Get user's cart contents",
    {
      userId: z.string().describe("User ID")
    },
    async (args) => {
      const cartItems = await getCart(args.userId);
      return {
        content: [
          {
            text: JSON.stringify(cartItems, null, 2),
            type: "text"
          }
        ]
      };
    }
  );

  server.tool(
    "submitCart",
    "Submit the cart of a user.",
    {
      userId: z.string().describe("User ID")
    },
    async (args) => {

      const clientCapabilities = server.server.getClientCapabilities();
      console.error("---- Client capabilities:", clientCapabilities);
      if (clientCapabilities?.elicitation) {

        const result = await server.server.elicitInput({
          message: `Are you sure you want to submit your cart "${args.userId}"`,
          requestedSchema: {
            type: 'object',
            properties: {
              confirmed: {
                type: 'boolean',
                description: 'Whether to confirm the action',
              },
            },
          },
        })

        const confirmed = result.action === 'accept' && result.content?.confirmed === true
        if (!confirmed) {
          const structuredContent = { success: false, userId: args.userId }
          return {
            content: [
              {
                text: JSON.stringify(structuredContent, null, 2),
                type: "text"
              },
              // structuredContent
            ],
          }
        }

      } else {
        console.error("Client does not support elicitation, skipping elicitation request");
      }

      const cartSummary = await submitCart(args.userId);
      return {
        content: [
          {
            text: JSON.stringify(cartSummary, null, 2),
            type: "text"
          }
        ]
      };
    }
  );
}
