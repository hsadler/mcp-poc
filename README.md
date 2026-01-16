# MCP Calculator POC

A simple proof of concept demonstrating a Model Context Protocol (MCP) server that integrates with Claude Desktop. The server provides a calculator tool that Claude can use to add numbers.

## Architecture

- **MCP Server**: Python server using FastMCP that implements the MCP protocol
- **Client**: Claude Desktop (connects to the MCP server automatically)

## Features

- MCP server with `add_numbers` tool
- Automatic tool discovery by Claude Desktop
- Dual transport support: stdio (production) and SSE (development)

## Prerequisites

- Python 3.11+
- [uv](https://github.com/astral-sh/uv) (Python package manager)
- [Claude Desktop](https://claude.ai/download) (for production use)
- Node.js with npx (for MCP Inspector)

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

4. Restart Claude Desktop (Cmd+Q to fully quit, then relaunch)

5. Look for the hammer icon in Claude Desktop's chat input — this indicates MCP tools are available

6. Start chatting! Try asking Claude to add numbers:
   - "Can you add 42 and 58?"
   - "What is 123.45 plus 67.89?"

## Development

### MCP Inspector (Recommended)

The MCP Inspector provides a web UI for interactive testing of your tools:

```bash
make inspect
```

This launches a web UI at `http://localhost:6274` where you can:
- View available tools and their schemas
- Call tools with custom inputs
- Inspect JSON-RPC messages
- Debug server responses

### Running in SSE Mode

Alternatively, run the server in SSE mode for programmatic testing:

```bash
make dev
```

The server will start at `http://127.0.0.1:8000/sse`.

### CLI Options

```
usage: main.py [-h] [--transport {stdio,sse}]

MCP Calculator Server

options:
  -h, --help            show this help message and exit
  --transport {stdio,sse}
                        Transport mode: stdio (for Claude Desktop) or sse (for development)
```

### Makefile Commands

| Command | Description |
|---------|-------------|
| `make inspect` | Launch MCP Inspector web UI at http://localhost:6274 |
| `make dev` | Run server in SSE mode for development |
| `make install` | Install dependencies |

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

## Technologies Used

- **MCP Server**: Python 3.11, FastMCP
- **Package Management**: uv
- **Client**: Claude Desktop

## License

MIT
