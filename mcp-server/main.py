import argparse
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("Calculator")


@mcp.tool()
async def add_numbers(a: float, b: float) -> str:
    """Add two numbers together and return the result"""
    result = a + b
    return f"The sum of {a} and {b} is {result}"


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="MCP Calculator Server")
    parser.add_argument(
        "--transport",
        choices=["stdio", "sse"],
        default="stdio",
        help="Transport mode: stdio (for Claude Desktop) or sse (for development)",
    )
    args = parser.parse_args()

    mcp.run(transport=args.transport)
