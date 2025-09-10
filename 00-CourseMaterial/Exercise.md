# MCP Workshop - Exercises



## 1. A Simple AI Chatbot

We are going to extend a simple chatbot with a tool.

In this exercise you can choose between a simple console-based chatbot implemented in Node or a simple web-based chatbot implemented in React. Choose the corresponding directory from the repository:

- `/01-chatbot-node`
- `/02-chatbot-react`

In the directory you have chosen: 

- first make a copy of the file `.env.example` with the name `.env` and **add your API Keys** for one or several AI-Providers

- then run the following commands:

```bash
npm install
npm start // for the node chatbot
npm run dev // for the react chatbot
```

This should start the chatbot on the command-line or it should start a web server serving the url `http://localhost:3000` , which you can open in your browser.

Study the implementation of the chatbot.
You can find more information about the used Vercel AI SDK here:

- https://ai-sdk.dev/docs/getting-started/nodejs

- https://ai-sdk.dev/docs/getting-started/nextjs-app-router





### Add Tools to the chatbot

- Add the predefined weather tool

Include `const tools = createTools();` and pass the tool to `streamText(...)`.



Node.js: in `index.js` output the result of the tool call with:

```
console.log(await result.toolResults);
```





React: On `page.tsx` add the snippet:

```
case 'tool-weather':
  return (
    <pre key={`${message.id}-${i}`}>
      {JSON.stringify(part.output, null, 2)}
    </pre>
  );
```



- Write an aditional get-time tool. With this the chatbot should be able to answert the question: "What is the current time?"

  



## 2. Your first MCP Server

Have a look at `10-mcp-stdio`.

```
npm install
npm run inspect
```

Call the tools via Inspector.



Try to call the Tools provided by the MCP Server from the chatbot of exercise 1.

```
import {experimental_createMCPClient as createMCPClient} from 'ai';
import {Experimental_StdioMCPTransport as StdioMCPTransport} from 'ai/mcp-stdio';

const mcpClient = await createMCPClient({
    transport: new StdioMCPTransport({
      command: 'npx',
      args: ['tsx', '../10-mcp-stdio/server.ts'],
    }),
});
const tools = await mcpClient.tools();
```



Try to call the tools provided by the MCP Server from:

- Claude Code -> Settings -> Developer ->Local MCP servers
- Visual Studio Code -> Ctrl-Shift-P -> MCP: Add Server
- Goose -> Extensions -> Add custom extensions



Experiment: Which clients can answer the question: "What is the current time?". Implement the get-time tool from exercise 1 ...





## 3. Build a remote MCP Server

Have a look at `11-mcp-remote`.

```
npm install
npm run start
npm run inspect
```

Call the tools via Inspector: Transport Type -> `Streamable HTTP`, URL: `http://localhost:4000`



Try to call the Tools provided by the MCP Server from the chatbot of exercise 1.

```
import {experimental_createMCPClient as createMCPClient} from 'ai';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const url = new URL('http://localhost:4000/mcp');

const mcpClient = await createMCPClient({
  transport: new StreamableHTTPClientTransport(url),
});

const tools = await mcpClient.tools();
```



Try to call the tools provided by the MCP Server from:

- Claude Code -> Settings -> Developer ->Local MCP servers => wrapp the call with `mcp-remote`: https://www.npmjs.com/package/mcp-remote

  ```
  "workshop-mcp-server-remote": {
    "command": "/usr/local/bin/npx",
    "args": ["mcp-remote", "http://localhost:4000/mcp"]
  },
  ```

- Visual Studio Code -> Ctrl-Shift-P -> MCP: Add Server

- Goose -> Extensions -> Add custom extensions



Again: Implement the get-time tool from exercise 1 ...





## 4. An MCP Server with Authentication

Have a look at `12-mcp-cloudflare-auth`.

For this exercise, I chose a starter template from Cloudflare:

https://developers.cloudflare.com/agents/guides/remote-mcp-server/#add-authentication

It takes quite some steps to get it running. Follow the instructions in ``12-mcp-cloudflare-auth/README` and consult the link above ...

```
npm install
npm run dev
npm run inspect
```

Call the tools via Inspector: Transport Type -> `Streamable HTTP`, URL: `http://localhost:8788` -> OAuth Flow will be triggerd once you connect ...



- I did not manage to connect via the chatbot from exercise 1.
- I did not manage to connect via Claude Code.
- I did manage to connect via Visual Studio Code
- I did manage to connect via Goose





## 5. Impement an MCP for a Webshop Interface

Have a look at the example Webshop Interface in `90-store-api`

```
npm install
npm run dev
npm run test
```



Take one of the previous MCP Impementations from 2,3 or 4.
Implement the tools to interact with this Webshop API. The most pragmatic aproach is to copy the file ``90-store-api/src/cart-api-client.ts` into the `tools` directory of the MCP implementation an then use these functions from the tool implementation.

- Test your tools with the MCP Inspector
- Connect via Claude Code, Visual Studio Code or via Goose ... play and have fun ....







## 6. Explore MCP Features

Demos: Only working when connecting with Visual Studio Code

- `30-mcp-elicitation-solution`
- `31-mcp-sampling-solution`





## 7. Bleeding Edge: MCP-UI

Demo:

```
// in mcp-server
npm install
npm run start
```

Start the fork of the inspector:

```
// in ui-inspector
npm install
npm run start
```

Call the tools via Inspector: Transport Type -> `Streamable HTTP`, URL: `http://localhost:4000`

Invoke the `get_product_detail` Tool.

Connect to Goose (Extension / `http://localhost:4000`). THen ask: "Please get the product details for product 42"

