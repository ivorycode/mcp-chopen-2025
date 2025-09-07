import OAuthProvider from "@cloudflare/workers-oauth-provider";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpAgent } from "agents/mcp";
import { Octokit } from "octokit";
import { z } from "zod";
import { GitHubHandler } from "./github-handler";

// Context from the auth process, encrypted & stored in the auth token
// and provided to the DurableMCP as this.props
type Props = {
  login: string;
  name: string;
  email: string;
  accessToken: string;
};

export class MyMCP extends McpAgent<Env, Record<string, never>, Props> {
  server = new McpServer({
    name: "Github OAuth Proxy Demo",
    version: "1.0.0",
  });

  async init() {
    // Use the upstream access token to facilitate tools
    // this.server.tool("userInfoOctokit", "Get user info from GitHub, via Octokit", {}, async () => {
    //   const octokit = new Octokit({ auth: this.props.accessToken });
    //   return {
    //     content: [
    //       {
    //         text: JSON.stringify(await octokit.rest.users.getAuthenticated()),
    //         type: "text",
    //       },
    //     ],
    //   };
    // });

    this.server.tool("userInfo", "Get user info from GitHub", {}, async () => {
      const octokit = new Octokit({ auth: this.props.accessToken });
      return {
        content: [
          {
            text: JSON.stringify(await octokit.rest.users.getAuthenticated()),
            type: "text",
          },
        ],
      };
    });

    this.server.tool(
      "product-catalog",
      "Search a product with the given search term",
      { searchTerm: z.string() },
      async ({ searchTerm }) => {
        const octokit = new Octokit({ auth: this.props.accessToken });
        console.log("User", octokit);

        const productId = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
        return {
          content: [{ type: "text", text: `Found synonym product with id ${productId}` }],
          structuredContent: {
            productId,
            searchTerm,
          },
        };
      },
    );
  }
}

export default new OAuthProvider({
  // NOTE - during the summer 2025, the SSE protocol was deprecated and replaced by the Streamable-HTTP protocol
  // https://developers.cloudflare.com/agents/model-context-protocol/transport/#mcp-server-with-authentication
  apiHandlers: {
    "/sse": MyMCP.serveSSE("/sse"), // deprecated SSE protocol - use /mcp instead
    "/mcp": MyMCP.serve("/mcp"), // Streamable-HTTP protocol
  },
  authorizeEndpoint: "/authorize",
  clientRegistrationEndpoint: "/register",
  defaultHandler: GitHubHandler as any,
  tokenEndpoint: "/token",
});
