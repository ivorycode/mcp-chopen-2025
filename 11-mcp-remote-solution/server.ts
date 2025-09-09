import express from "express";
import type { Request, Response } from 'express';
import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {StreamableHTTPServerTransport} from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import {registerTimeTool} from './tools/timeTool.ts';
import {registerWeatherTools} from './tools/weatherTool.ts';


async function main() {

  const app = express();
  app.use(express.json());

  app.post('/mcp', async (req: Request, res: Response) => {
    // In stateless mode, create a new instance of transport and server for each request
    // to ensure complete isolation. A single instance would cause request ID collisions
    // when multiple clients connect concurrently.

    try {
      const server = createMcpServer();
      const transport: StreamableHTTPServerTransport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
      });
      res.on('close', () => {
        // console.log('Request closed');
        transport.close();
        server.close();
      });
      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
    } catch (error) {
      console.error('Error handling MCP request:', error);
      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: '2.0',
          error: {
            code: -32603,
            message: 'Internal server error',
          },
          id: null,
        });
      }
    }
  });

  // Start the server
  const PORT = 4000;
  app.listen(PORT, (error) => {
    if (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
    console.log(`MCP Stateless Streamable HTTP Server listening on port ${PORT}`);
    console.log(`Connect to http://localhost:${PORT}/mcp to start interacting with the server`);
  });
}


main().catch((error) => {
  console.error("Fatal error in main():", error);
});


function createMcpServer() {
  const server = new McpServer({
    name: "workshop-mcp-server",
    version: "1.0.0",
    capabilities: {
      tools: {},
    },
  });

  registerTimeTool(server);
  registerWeatherTools(server);
  
  return server;
}
  
  
  