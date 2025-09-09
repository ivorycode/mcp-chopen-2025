import {tool} from 'ai';
import {z} from 'zod';

export function createTools() {
  return ({
    time: tool({
      description: 'Get the current time',
      inputSchema: z.object({}),
      execute: async () => {
        const time = new Date().toLocaleTimeString();
        console.log(`\n\n-- Tool: TIME ${time} --\n\n`)
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
        console.log(`\n\n-- Tool: GET WEATHER ${location} ${temperature} --\n\n`)
        return {
          location,
          temperature,
        };
      },
    }),
    convertFahrenheitToCelsius: tool({
      description: 'Convert a temperature in fahrenheit to celsius',
      inputSchema: z.object({
        temperature: z
          .number()
          .describe('The temperature in fahrenheit to convert'),
      }),
      execute: async ({ temperature }) => {
        const celsius = Math.round((temperature - 32) * (5 / 9));
        console.log(`\n\n-- Tool: TEMP CONVERT ${temperature} -> ${celsius} --\n\n`)
        return {
          celsius,
        };
      },
    }),
  })
}
