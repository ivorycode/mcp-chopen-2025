import {experimental_createMCPClient as createMCPClient} from 'ai';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const url = new URL('http://localhost:4000/mcp');

export async function createMcpRemoteClient() {

  const mcpClient = await createMCPClient({
    transport: new StreamableHTTPClientTransport(url),
  });

  return mcpClient;

}
