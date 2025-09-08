import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {registerTimeTool} from './tools/timeTool.ts';
import {registerWeatherTools} from './tools/weatherTool.ts';

const server = new McpServer({
  name: "workshop-mcp-server",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

registerTimeTool(server);
registerWeatherTools(server);
 
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Minimal MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});