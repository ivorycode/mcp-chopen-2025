import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { addToCart, getCart, searchProducts } from "./cart-api-client.ts";

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

        console.error("---- Client capabilities:", clientCapabilities);

        if (!clientCapabilities?.sampling) {
          console.error("Client does not support sampling, skipping sampling request");
          return {
            content: [{ type: "text", text: `No products found that are matching the term ${args.query}` }]
          };
        } else {
          console.error("Client supports sampling, sending sampling request");
          const result = await server.server.createMessage({
            systemPrompt: ``,
            messages: [
              {
                role: "user",
                content: {
                  type: "text",
                  // mimeType: 'application/json',
                  text: createSynonymPrompt(args.query)
                }
              }
            ],
            maxTokens: 100
          });

          const resultSchema = z.object({
            content: z.object({
              type: z.literal("text"),
              text: z.string()
            })
          });

          const parsedResult = resultSchema.parse(result);

          const synonymSchema = z.string();
          const synonym = synonymSchema.parse(parsedResult.content.text);

          const products = await searchProducts(synonym);

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
                searchTerm: args.query,
                synonym
              }
            };
          } else {
            return {
              content: [{ type: "text", text: `No products found that are matching the term ${args.query}` }]
            };
          }

        }
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
}


function createSynonymPrompt(searchTerm: string) {
  const SYNONYM_PROMPT = `
"Provide a single-word alternative in German for the term ${searchTerm} that would be effective for search engine queries. Return only the alternative word without explanation or additional text. Choose the most commonly used alternative that maintains the core meaning of the original term."
Usage example:

Input: "pepper"
Output: "Pfeffer"

Key features of this prompt:

Requests only the synonym word, no extra text
Emphasizes single-word responses for clean search queries
Focuses on commonly used alternatives for better search results
Maintains semantic meaning while offering variation
Designed for direct integration into search workflows
`;
  return SYNONYM_PROMPT;
}