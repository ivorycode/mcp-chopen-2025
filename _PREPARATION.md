Please prepare your laptop before the course with the following steps.



### KI-Clients und KI-Subscriptions (kostenpflichtig!)

Wir werden zusammen MCP-Server entwickeln. MCP Server können grundsätzlich ohne aufrufende KI entwickelt und auch rudimentär getestet werden. Aber richtig Spass macht es erst, wenn die Tools, die ein MCP-Server anbietet, auch von einer KI aufgerufen werden.

Um diesen Workshop richtig geniessen zu können, sollten Sie daher, möglichst viele verschiedene KI-Clients und KI-Subscriptions mitbringen. Diese sind kostenpflichtig, und es liegt in ihrer Verantwortung diese zu organisieren.

Ich werde im Workshop folgende Tools und Subscriptions verwenden. Ich empfehle, dass Sie möglichst einige davon auch bei sich installieren und einrichten.



#### Standalone Clients

- **Claude Desktop** mit Subscription (oder Free Trial Version)   https://claude.ai/download  
- **Visual Studio Code Insiders** mit Visual Studio Code Copilot Subscription (oder Trial Version) => wichtig: die "Insider" Version vom Visual Studio Code installieren (kann parallel zum normalen Visual Studio Code installiert werden)
  - https://code.visualstudio.com/insiders/
  - You need a GitHub Account and a Github Copilot Subscription (the free plan should work):  https://code.visualstudio.com/docs/copilot/setup?originUrl=/docs/copilot/overview
- **Goose**
  - https://block.github.io/goose/docs/getting-started/installation/



#### Programmatic Clients:

Sie sollten (mindestens) einen API Key haben um einen der "grossen" LLM Anbieter zu nutzen, das ist meines Wissens bei allen Anbietern kostenpflichtig. Aber der Betrag, welchen wir in dem Workshop aufwenden werden, ist winzig (ich habe beim Vorbereiten des Workshops weniger als 10 CHF aufgewendet).

- OpenAI: https://platform.openai.com/api-keys
- Anthropic: https://console.anthropic.com/settings/keys
- Google Gemini: https://aistudio.google.com/app/apikey

Wir nutzen in dem Workshop die [Vercel AI SDK](https://ai-sdk.dev/docs/introduction), welche [die Anbindung von verschiedenen LLM Providers](https://ai-sdk.dev/docs/foundations/providers-and-models) anbietet. Es können auch lokale LLMs angebunden werden, aber ich habe damit keine Erfahrung und kann im Workshop keine Unterstützung bieten. 



---



### Overview Infrastructure Installation:

The following steps are needed for the setup. Below are detailed informations for each of the steps.

1. Install Git
2. Install NodeJS
3. Install Chrome
4. Install an editor. Recommended: *IntelliJ Ultimate*, *WebStorm* or *Visual Studio Code*
5. Clone the repo: `https://github.com/ivorycode/mcp-chopen-2025`



If you have any questions or problems concerning the instructions below, please contact: jonas.bandi@ivorycode.com

### Important:

Make sure that you have **unrestricted access to the internet**! In the steps below you will have to access *Bitbucket*, *GitHub* and *npmjs.org*. Some corporate proxies block these sites or block access over https or git!

If you are already using node/npm, make sure that you __don't__ have a global npm-proxy configured. (Check: `npm config get proxy` should return `null`). If it does not return `null`, then you should probably comment out the corresponding proxy in the file `.npmrc` in your home or profile directory.





### AI-Clients und AI-Subscriptions (kostenpflichtig!)

Wir werden zusammen MCP-Server entwickeln. MCP Server können grundsätzlich ohne aufrufende AI entwickelt und auch rudimentär getestet werden.
Aber richtig Spaß macht es erst, wenn die Tools, die ein MCP-Server anbietet, auch von einer KI aufgerufen werden.

Um diesen Workshop richtig genießen zu können, sollten Sie daher, möglichst viele verschiedene AI-Clients und AI-Subscriptions mitbringen.

Ich werde im Workshop folgende Tools und Subscriptions verwenden. Ich empfehle, dass Sie möglichst einige davon auch bei sich installieren und einrichten.



#### Standalone Clients

- **Claude Desktop** mit Subscription (oder Free Trial Version)  
  https://claude.ai/download  
- **Visual Studio Code Insiders** mit Visual Studio Code Copilot Subscription (oder Trial Version)
  => wichtig: die "Insider" Version vom Visual Studio Code installieren (kann parallel zum normalen Visual Studio Code installiert werden)
  - https://code.visualstudio.com/insiders/
  - You need a GitHub Account and a Github Copilot Subscription (the free plan should work): 
    https://code.visualstudio.com/docs/copilot/setup?originUrl=/docs/copilot/overview
- **Goose**
  - https://block.github.io/goose/docs/getting-started/installation/



#### Programmatic Clients:

Sie sollten (mindestens) einen API Key haben um einen der "grossen" LLM Anbieter zu nutzen, das ist meines Wissens bei allen Anbietern kostenpflichtig. Aber der Betrag welchen wir in dem Workshop aufwenden werden ist winzig (ich habe beim Vorbereiten des Workshops weniger als 10 CHF aufgewendet).

- OpenAI: https://platform.openai.com/api-keys
- Anthropic: https://console.anthropic.com/settings/keys
- Google Gemini: https://aistudio.google.com/app/apikey

Wir nutzen in dem Workshop die [Vercel AI SDK](https://ai-sdk.dev/docs/introduction) welche [die Anbindung von verschiedenen LLM Providers](https://ai-sdk.dev/docs/foundations/providers-and-models) anbietet. Es können auch lokale LLMs angebudnen werden, aber ich habe damit keine Erfahrung und kann im Workshop keine Unterstützung bieten. 





## Software Installation

For the workshop the following software should be installed.  

**The version numbers don't have to match exactly, but they should be pretty close!**



### Git

A recent git installation is needed to download the sample code and exercises.  
Git can be downloaded from here: <https://git-scm.com/download/>

Check:  

 ```
git --version                                                             
git version 2.49.0
 ```



### Node.js & NPM 

Node and NPM are the fundament for the JavaScript toolchain.  
The Node installer can be downloaded here: <https://nodejs.org/>

Install the latest version of Node.js LTS.  

Check:

```
> node --version
v22.14.0
> npm --version
10.9.2
```



### Browser

A recent modern browser must be available. Recommended: Chrome.



### Optional:  IntelliJ, WebStorm or Visual Studio Code

[IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/),  [WebStorm](http://www.jetbrains.com/webstorm), [Rider](https://www.jetbrains.com/rider/) or [Visual Studio Code](https://code.visualstudio.com/) are all very good IDEs/editors for web development.  
Notes: 

- IntelliJ IDEA Community does *not* support JavScript/TypeScript development.
- WebStorm supports the same features as IntelliJ IDEA Ultimate or Rider for frontend development.

These editors are not a requirement for the workshop. However the examples and demos will be shown with WebStorm. It is up to the attendees to use any other editor of their preference. 



## Course Material

All the course material will be provided in the following repository:

	https://github.com/ivorycode/mcp-chopen-2025

Please clone the repo like this:

	git clone https://github.com/ivorycode/mcp-chopen-2025.git


To update the repo later (please update the repo in the morning of the workshop):

```
cd mcp-chopen-2025
git pull
```





