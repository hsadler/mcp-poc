# MCP Calculator POC

A simple proof of concept demonstrating a Model Context Protocol (MCP) server that integrates with Claude Desktop. The server provides a calculator tool that Claude can use to add numbers.

## Architecture

- **MCP Server**: Python server using FastMCP that implements the MCP protocol
- **Expected Client**: Claude Desktop (connects to the MCP server automatically)

## Features

- MCP server with `add_numbers` tool
- Automatic tool discovery by Claude Desktop
- MCP Inspector for interactive testing and debugging

## Prerequisites

- [uv](https://github.com/astral-sh/uv) (Python package manager)
- node and npx (install with brew: `brew install node`)
- [Claude Desktop](https://claude.ai/download) (for production use)

## Quick Start

1. Clone this repository

2. Install dependencies:
   ```bash
   cd mcp-server
   uv sync
   ```

3. Configure Claude Desktop by editing `~/Library/Application Support/Claude/claude_desktop_config.json`:
   ```json
   {
     "mcpServers": {
       "calculator": {
         "command": "/path/to/uv",
         "args": ["--directory", "/path/to/mcp-poc/mcp-server", "run", "main.py"]
       }
     }
   }
   ```

   Replace `/path/to/uv` with the output of `which uv` and `/path/to/mcp-poc` with the actual path to this project.

4. Start chatting! Try asking Claude to add numbers:
   - "Can you add 42 and 58?"
   - "What is 123.45 plus 67.89?"

## Development

### MCP Inspector (Recommended)

The MCP Inspector provides a web UI for interactive testing of your tools:

```bash
make dev
```

This launches a web UI at `http://localhost:6274` where you can:
- View available tools and their schemas
- Call tools with custom inputs
- Inspect JSON-RPC messages
- Debug server responses

## Project Structure

```
.
├── mcp-server/              # MCP Server (Python/FastMCP)
│   ├── main.py             # MCP server with calculator tool
│   └── pyproject.toml      # Python dependencies
├── Makefile                 # Development commands
└── README.md               # This file
```

## Available Tools

### add_numbers

Adds two numbers together and returns the result.

**Parameters:**
- `a` (number): First number to add
- `b` (number): Second number to add

**Example usage in Claude Desktop:**
> "Can you add 42 and 58?"

Claude will use the `add_numbers` tool and respond with the result.

## How It Works

1. Claude Desktop reads the MCP server config on startup
2. It spawns the MCP server as a subprocess using stdio transport
3. When you chat with Claude, it can discover and use the available tools
4. Tool calls are sent to the MCP server via stdin, results returned via stdout
5. Claude processes the result and responds in natural language
