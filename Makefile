.PHONY: dev inspect install

# Run MCP server in SSE mode for development
dev:
	cd mcp-server && uv run main.py --transport sse

# Launch MCP Inspector web UI for interactive testing
inspect:
	cd mcp-server && npx @modelcontextprotocol/inspector uv run python main.py

# Install dependencies
install:
	cd mcp-server && uv sync
