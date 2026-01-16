from mcp.server.fastmcp import FastMCP

mcp = FastMCP("Calculator")


@mcp.tool()
async def add_numbers(a: float, b: float) -> str:
    """Add two numbers together and return the result"""
    result = a + b
    return f"The sum of {a} and {b} is {result}"


if __name__ == "__main__":
    mcp.run(transport="stdio")
