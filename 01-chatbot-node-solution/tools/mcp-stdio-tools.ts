import {experimental_createMCPClient as createMCPClient} from 'ai';
import {Experimental_StdioMCPTransport as StdioMCPTransport} from 'ai/mcp-stdio';

export async function createMcpStdioClient() {

  const mcpClient = await createMCPClient({
    transport: new StdioMCPTransport({
      command: 'npx',
      args: ['tsx', '../10-mcp-stdio-solution/server.ts'],
    }),
  });

  return mcpClient;
}
