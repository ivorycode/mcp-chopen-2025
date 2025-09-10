import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
// @ts-ignore
import { createUIResource } from "@mcp-ui/server";
import {z} from 'zod';

export function registerProductTool(server: McpServer, PORT: number){
  server.tool(
    "get_product_detail",
    "Fetch the details for a product with a given id",
    {
      productId: z.string().describe('The id of the product to fetch details for'),
    },
    async ({productId}) => {
      const productDetail = {
        id: "123",
        name: "Product 1",
        description: "This is a product description",
        price: 100.00,
        stock: 10,
      };
      console.log(`\n\n -- SERVER: GET PRODUCT DETAIL  --\n\n`, productDetail)
      return {
        content: [{
          type: "text",
          text: `Product Detail: ${JSON.stringify(productDetail)}`
        },
          createUIResource({
            uri: `ui://product-catalog/article/${productId}`,
            content: {
              type: "externalUrl",
              iframeUrl: `http://localhost:${PORT}/product-preview/${productId}`,
            },
            encoding: "text",
          }),
        
        ],
        structuredContent: {
          productDetail
        },
        
      };
    }
  )
}