from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import uvicorn

app = FastAPI(title="MCP Calculator Server")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Tool(BaseModel):
    name: str
    description: str
    input_schema: Dict[str, Any]

class ToolCallRequest(BaseModel):
    name: str
    arguments: Dict[str, Any]

class ToolCallResponse(BaseModel):
    content: List[Dict[str, Any]]

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/mcp/list_tools")
async def list_tools():
    """List available MCP tools"""
    return {
        "tools": [
            {
                "name": "add_numbers",
                "description": "Add two numbers together and return the result",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "a": {
                            "type": "number",
                            "description": "First number to add"
                        },
                        "b": {
                            "type": "number",
                            "description": "Second number to add"
                        }
                    },
                    "required": ["a", "b"]
                }
            }
        ]
    }

@app.post("/mcp/call_tool")
async def call_tool(request: ToolCallRequest):
    """Execute an MCP tool"""
    if request.name == "add_numbers":
        a = request.arguments.get("a")
        b = request.arguments.get("b")

        if a is None or b is None:
            return {
                "content": [
                    {
                        "type": "text",
                        "text": "Error: Both 'a' and 'b' parameters are required"
                    }
                ],
                "isError": True
            }

        try:
            result = float(a) + float(b)
            return {
                "content": [
                    {
                        "type": "text",
                        "text": f"The sum of {a} and {b} is {result}"
                    }
                ]
            }
        except (ValueError, TypeError) as e:
            return {
                "content": [
                    {
                        "type": "text",
                        "text": f"Error: Invalid number format - {str(e)}"
                    }
                ],
                "isError": True
            }
    else:
        return {
            "content": [
                {
                    "type": "text",
                    "text": f"Error: Unknown tool '{request.name}'"
                }
            ],
            "isError": True
        }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
