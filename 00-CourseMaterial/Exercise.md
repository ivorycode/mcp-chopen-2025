# MCP Workshop - Exercises



## A Simple AI Chatbot

We are going to extend a simple chatbot with a tool.

In this exercise you can choose between a simple console-based chatbot implemented in Node or a simple web-based chatbot implemented in React. Choose the corresponding directory from the repository:

- `/01-chatbot-node`
- `/02-chatbot-react`

In the directory you have chosen: 

- first make a copy of the file `.env.example` with the name `.env` and **add your API Keys** for one or several AI-Providers

- then run the following commands:

```bash
npm install
npm start
```

This should start the chatbot on the command-line or it should start a web server serving the url `http://localhost:3000` , which you can open in your browser.

Study the implementation of the chatbot.
You can find more information about the used Vercel AI SDK here:

- https://ai-sdk.dev/docs/getting-started/nodejs

- https://ai-sdk.dev/docs/getting-started/nextjs-app-router





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





