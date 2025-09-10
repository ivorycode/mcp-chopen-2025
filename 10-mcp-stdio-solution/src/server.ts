import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {registerTimeTool} from './tools/timeTool.js';
import {registerWeatherTools} from './tools/weatherTool.js';

const server = new McpServer({
  name: "workshop-mcp-server",
  version: "1.0.0",
  capabilities: {
    tools: {},
  },
});

registerTimeTool(server);
registerWeatherTools(server);
 
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("\n\n-- MCP Server: Workshop Server running on stdio\n\n");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});