import { Octokit } from "octokit";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export async function registerUserInfoTool(server: McpServer, accessToken: string) {
  const octokit = new Octokit({ auth: accessToken });
  let userInfo = await octokit.rest.users.getAuthenticated();
  let userId = userInfo.data.login;
  server.tool("userInfo", "Get the userId of the logged in user", {}, async () => {
    return {
      content: [
        {
          text: `The user ID of the currently logged-in user is: ${userId}`,
          type: "text",
        },
      ],
      structuredContent: {
        userId,
      },
    };
  });
}
