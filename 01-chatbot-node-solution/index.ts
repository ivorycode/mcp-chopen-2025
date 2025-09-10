import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';
import {ModelMessage, stepCountIs, streamText} from 'ai';
import 'dotenv/config';
import * as readline from 'node:readline/promises';
import {createTools} from './tools/tools.ts';
import {createMcpStdioClient} from './tools/mcp-stdio-tools.ts';
import {createMcpRemoteClient} from './tools/mcp-remote-tools.js';

const terminal = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const messages: ModelMessage[] = [];

// const tools = createTools();
const mcpClient = await createMcpStdioClient();
// const mcpClient = await createMcpRemoteClient();
const tools = await mcpClient.tools();

async function main() {
  while (true) {
    const userInput = await terminal.question('You: ');

    messages.push({ role: 'user', content: userInput });

    const result = streamText({
      // model: openai('gpt-4o'),
      // model: anthropic('claude-3-7-sonnet-20250219'),
      model: google('gemini-2.5-flash'),
      messages,
      tools,
      stopWhen: stepCountIs(5),
    });

    let fullResponse = '';
    process.stdout.write('\nAssistant: ');
    for await (const delta of result.textStream) {
      fullResponse += delta;
      process.stdout.write(delta);
    }
    process.stdout.write('\n\n');

    // console.log(await result.toolCalls);
    const results = await result.toolResults;
    // console.log(results);
    // console.log(results?.at(-1)?.output);
    messages.push({ role: 'assistant', content: fullResponse });
  }
}

main().catch((e) => {
  console.error(e);
  terminal.close()
  // mcpClient.close();
});