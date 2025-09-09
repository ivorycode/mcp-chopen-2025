import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerTimeTool(server: McpServer){
  server.tool(
    "get_time", 
    "Get the current time",
    async () => {
      let date = new Date().toISOString();
      console.error(`\n\n-- MCP Server: GET TIME ${location} ${date} --\n\n`)
      return {
        content: [{
          type: "text",
          text: `Current Date: ${date}`
        }],
        structuredContent: {
          date
        }
      };
    }
  )
}