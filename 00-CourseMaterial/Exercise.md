# MCP Workshop - Exercises



## A Simple AI Chatbot

https://ai-sdk.dev/docs/getting-started/nodejs

https://ai-sdk.dev/docs/getting-started/nextjs-app-router



### Run the chatbot

Add your API Key to `.env`



### Add Tools to the chatbot

- Add the predefined weather tool

Include `const tools = createTools();` and pass the tool to `streamText`.



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



- Write a get-time tool



## Your first MCP Server

- Implement the get_time tool in the server.
- Test the get_time tool in the MCP Inspector
- Consume the get_time tool in the Chatbot
- Consume the MCP Server Tools in a standalone Client



## Build a remote MCP Server

- Start the remote MCP Server. Study the implementation.
- Test the remote MCP Server with the MCP Inspector
- Change the Chatbot from the previous exercise to connect to the Remote MCP Server







## Explore MCP Features







## Bleeding Edge: MCP-UI





