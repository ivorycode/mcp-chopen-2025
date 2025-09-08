import {experimental_createMCPClient as createMCPClient} from 'ai';
import {Experimental_StdioMCPTransport as StdioMCPTransport} from 'ai/mcp-stdio';

export async function createMcpClient() {

  const mcpClient = await createMCPClient({
    transport: new StdioMCPTransport({
      command: 'npx',
      args: ['tsx', '../mcp-server/server.ts'],
    }),
  });

  return mcpClient;

}
