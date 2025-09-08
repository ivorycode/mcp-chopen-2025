import {openai} from '@ai-sdk/openai';
import {anthropic} from '@ai-sdk/anthropic';
import {google} from '@ai-sdk/google';
import {ModelMessage, stepCountIs, streamText} from 'ai';
import 'dotenv/config';
import * as readline from 'node:readline/promises';
import {createMcpClient} from './tools/mcp-tools.ts';

const terminal = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const messages: ModelMessage[] = [];
const mcpClient = await createMcpClient();
const tools = await mcpClient.tools();

async function main() {
  console.log('TOOLS:', Object.keys(tools))

  while (true) {
    const userInput = await terminal.question('You: ');

    messages.push({role: 'user', content: userInput});

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
    let message = results?.at(-1)?.output;
    message && console.log(message);
    // messages.push({role: 'assistant', content: fullResponse});
  }
}

main().catch((e) => {
  console.error(e);
  mcpClient.close();
});