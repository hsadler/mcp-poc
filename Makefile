.PHONY: dev

# Launch MCP Inspector web UI for interactive development and testing
dev:
	npx @modelcontextprotocol/inspector uv run python mcp-server/main.py
