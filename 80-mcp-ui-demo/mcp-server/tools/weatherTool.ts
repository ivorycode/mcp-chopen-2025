import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import {z} from 'zod';

export function registerWeatherTools(server: McpServer) {
  server.tool(
    "get_weather",
    "Get the weather in a location (fahrenheit)",
    {
      location: z
        .string()
        .describe('The location to get the weather for'),
    },
    async ({location}) => {
      const temperature = Math.round(Math.random() * (90 - 32) + 32);
      const structuredContent = {
        location,
        temperature,
      };
      console.error(`\n\n -- GET WEATHER ${location} ${temperature} --\n\n`)
      return {
        structuredContent,
        content: [{
          type: "text",
          text: `The temperature in ${location} is ${temperature} degrees fahrenheit`,
        }]
      }
    },
  );

  server.tool(
    "convert_fahrenheit_to_celsius",
    "Convert a temperature in fahrenheit to celsius",
    {
      temperature: z
        .number()
        .describe('The temperature in fahrenheit to convert'),
    },
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
    },
  );
}