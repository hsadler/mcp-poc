
# History of Claude Code vibing
1. Asked to build a simple MCP server and chat client that can add two numbers together.
2. After some initial struggles with API key and available models, we got it working. The client was a one-shot success.
3. Asked to simplify the client to be Claude Desktop based instead of a custom html/js based client. It converted the MCP server from HTTP/FastAPI to stdio transport using FastMCP, which Claude Desktop requires. It then configured Claude Desktop via `~/Library/Application Support/Claude/claude_desktop_config.json` to spawn the MCP server as a subprocess. The calculator tool now works directly in Claude Desktop.
