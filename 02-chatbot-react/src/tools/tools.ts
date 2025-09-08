import {tool} from 'ai';
import {z} from 'zod';

export function createTools() {
  return ({
    time: tool({
      description: 'Get the current time',
      inputSchema: z.object({}),
      execute: async () => {
        const time = new Date().toLocaleTimeString();
        return {
          time,
        };
      }
    }),
    weather: tool({
      description: 'Get the weather in a location (fahrenheit)',
      inputSchema: z.object({
        location: z
          .string()
          .describe('The location to get the weather for'),
      }),
      execute: async ({location}) => {
        const temperature = Math.round(Math.random() * (90 - 32) + 32);
        return {
          location,
          temperature,
        };
      },
    }),
  })
}
