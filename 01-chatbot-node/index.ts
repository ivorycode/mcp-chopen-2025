import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';
import {ModelMessage, stepCountIs, streamText} from 'ai';
import 'dotenv/config';
import * as readline from 'node:readline/promises';
import {createTools} from './tools/tools';

// const tools = createTools(); // Exercise ...

const terminal = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const messages: ModelMessage[] = [];

async function main() {
  while (true) {
    const userInput = await terminal.question('You: ');

    messages.push({ role: 'user', content: userInput });

    const result = streamText({
      // model: openai('gpt-4o'),
      // model: anthropic('claude-3-7-sonnet-20250219'),
      model: google('gemini-2.5-flash'),
      messages,
      stopWhen: stepCountIs(5), // preparation for Exercise
    });

    let fullResponse = '';
    process.stdout.write('\nAssistant: ');
    for await (const delta of result.textStream) {
      fullResponse += delta;
      process.stdout.write(delta);
    }
    process.stdout.write('\n\n');

    // console.log(await result.toolCalls); // Exercise ...
    // console.log(await result.toolResults); // Exercise ...
    messages.push({ role: 'assistant', content: fullResponse });
  }
}

main().catch(console.error);