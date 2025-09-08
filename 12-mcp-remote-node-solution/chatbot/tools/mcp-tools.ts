import {experimental_createMCPClient as createMCPClient} from 'ai';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
  
const url = new URL('http://localhost:3000/mcp');

export async function createMcpClient() {

  const mcpClient = await createMCPClient({
    transport: new StreamableHTTPClientTransport(url),
  });

  return mcpClient;

}
