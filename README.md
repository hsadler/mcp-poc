# MCP Calculator POC

A simple proof of concept demonstrating Claude AI chat integration with a Model Context Protocol (MCP) server. This project includes a web-based chat client that connects to Claude and uses an MCP server to perform calculator operations.

## Architecture

- **MCP Server**: Python FastAPI server that implements the MCP protocol with a single tool to add two numbers
- **Web Client**: Node.js/Express server that serves a chat UI and proxies requests to Claude API
- **Docker**: Both services are containerized and orchestrated with docker-compose

## Features

- Chat interface to interact with Claude
- MCP server with `add_numbers` tool
- Automatic tool discovery and execution
- Containerized deployment with Docker

## Prerequisites

- Docker and Docker Compose
- Anthropic API key (get one at https://console.anthropic.com/settings/keys)

## Quick Start

1. Clone this repository

2. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` and add your Anthropic API key:
   ```
   ANTHROPIC_API_KEY=your_actual_api_key_here
   ```

4. Start the services with Docker Compose:
   ```bash
   docker-compose up --build
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

6. Start chatting! Try asking Claude to add numbers, for example:
   - "Can you add 42 and 58?"
   - "What is 123.45 plus 67.89?"
   - "Add 1000 and 2000 together"

## Project Structure

```
.
├── mcp-server/              # MCP Server (Python/FastAPI)
│   ├── main.py             # FastAPI application with MCP endpoints
│   ├── pyproject.toml      # Python dependencies (managed by uv)
│   └── Dockerfile          # Docker configuration
├── client/                  # Web Client (Node.js/Express)
│   ├── server.js           # Express server and Claude API integration
│   ├── public/
│   │   ├── index.html      # Chat UI
│   │   └── app.js          # Frontend JavaScript
│   ├── package.json        # Node.js dependencies
│   └── Dockerfile          # Docker configuration
├── docker-compose.yml       # Docker Compose orchestration
├── .env.example            # Environment variables template
└── README.md               # This file
```

## MCP Endpoints

The MCP server exposes the following endpoints:

- `GET /health` - Health check endpoint
- `POST /mcp/list_tools` - Returns available MCP tools
- `POST /mcp/call_tool` - Executes an MCP tool

## Available Tools

### add_numbers

Adds two numbers together and returns the result.

**Parameters:**
- `a` (number): First number to add
- `b` (number): Second number to add

**Example:**
```json
{
  "name": "add_numbers",
  "arguments": {
    "a": 42,
    "b": 58
  }
}
```

**Response:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "The sum of 42 and 58 is 100"
    }
  ]
}
```

## Development

### Running Locally Without Docker

**MCP Server:**
```bash
cd mcp-server
uv sync
uv run python main.py
```

**Client:**
```bash
cd client
npm install
ANTHROPIC_API_KEY=your_key npm start
```

### Stopping the Services

```bash
docker-compose down
```

### Viewing Logs

```bash
docker-compose logs -f
```

## How It Works

1. User types a message in the web chat interface
2. Client sends the message to the Express backend
3. Backend fetches available tools from the MCP server
4. Backend sends the message and tools to Claude API
5. If Claude wants to use a tool, it returns a tool_use response
6. Backend calls the MCP server with the tool request
7. MCP server executes the tool and returns the result
8. Backend sends the tool result back to Claude
9. Claude processes the result and generates a response
10. Response is displayed in the chat interface

## Technologies Used

- **Backend**: Python 3.11, FastAPI, uvicorn
- **Frontend**: Node.js 20, Express, vanilla JavaScript
- **AI**: Claude 3.5 Sonnet (via Anthropic API)
- **Package Management**: uv (Python), npm (Node.js)
- **Containerization**: Docker, Docker Compose

## License

MIT
