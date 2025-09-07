import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';
import {streamText, UIMessage, convertToModelMessages, stepCountIs} from 'ai';
import {createTools} from '@/tools/tools';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const tools = createTools();

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    // model: openai('gpt-4o'),
    // model: anthropic('claude-3-7-sonnet-20250219'),
    model: google('gemini-2.5-flash'),
    messages: convertToModelMessages(messages),
    tools,
    stopWhen: stepCountIs(5),
  });

  return result.toUIMessageStreamResponse();
}