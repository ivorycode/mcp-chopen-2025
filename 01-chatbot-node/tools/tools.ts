import {tool} from 'ai';
import {z} from 'zod';

export function createTools() {
  return ({
    weather: tool
    ({
      description: 'Get the weather in a location (fahrenheit)',
      inputSchema: z.object({
        location: z
          .string()
          .describe('The location to get the weather for'),
      }),
      execute: async ({location}) => {
        console.error(`\n\n-------- WEATHER TOOL: GET WEATHER: ${location}\n\n`);
        const temperature = Math.round(Math.random() * (90 - 32) + 32);
        return {
          location,
          temperature,
        };
      },
    }),
    temperatureConvert: tool({
      description: "Convert a temperature in fahrenheit to celsius",
      inputSchema:
        z.object({
          temperature: z
            .number()
            .describe('The temperature in fahrenheit to convert'),
        }),
      execute:
        async ({temperature}) => {
          const celsius = Math.round((temperature - 32) * (5 / 9));
          console.error(`\n\n-- CONVERT TEMP ${temperature} -> ${celsius} --\n\n`)
          return {
            structuredContent: {
              celsius,
            },
            content: [{
              type: "text",
              text: `The temperature in celsius is ${celsius}`,
            }],
          };
        }
    })
  })
}