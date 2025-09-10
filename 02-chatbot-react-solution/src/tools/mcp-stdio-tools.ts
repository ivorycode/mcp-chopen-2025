import {experimental_createMCPClient as createMCPClient} from 'ai';
import {Experimental_StdioMCPTransport as StdioMCPTransport} from 'ai/mcp-stdio';

export async function createMcpStdioClient() {

  const mcpClient = await createMCPClient({
    transport: new StdioMCPTransport({
      command: 'node',
      args: ['../10-mcp-stdio/dist/server.js'],
    }),
  });

  return mcpClient;
}
