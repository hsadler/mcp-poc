const express = require('express');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const app = express();
app.use(express.json());
app.use(express.static('public'));

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MCP_SERVER_URL = process.env.MCP_SERVER_URL || 'http://mcp-server:8000';

async function getMCPTools() {
    try {
        const response = await fetch(`${MCP_SERVER_URL}/mcp/list_tools`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        return data.tools;
    } catch (error) {
        console.error('Error fetching MCP tools:', error);
        return [];
    }
}

async function callMCPTool(toolName, toolArguments) {
    try {
        const response = await fetch(`${MCP_SERVER_URL}/mcp/call_tool`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: toolName,
                arguments: toolArguments
            })
        });
        return await response.json();
    } catch (error) {
        console.error('Error calling MCP tool:', error);
        return {
            content: [{ type: 'text', text: `Error calling tool: ${error.message}` }],
            isError: true
        };
    }
}

app.post('/api/chat', async (req, res) => {
    try {
        const { messages } = req.body;

        if (!ANTHROPIC_API_KEY) {
            return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });
        }

        const tools = await getMCPTools();

        let currentMessages = [...messages];
        let shouldContinue = true;

        while (shouldContinue) {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': ANTHROPIC_API_KEY,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: 'claude-sonnet-4-5-20250929',
                    max_tokens: 4096,
                    messages: currentMessages,
                    tools: tools
                })
            });

            if (!response.ok) {
                const error = await response.text();
                return res.status(response.status).json({ error });
            }

            const claudeResponse = await response.json();

            if (claudeResponse.stop_reason === 'tool_use') {
                const toolUseBlock = claudeResponse.content.find(block => block.type === 'tool_use');

                if (toolUseBlock) {
                    const toolResult = await callMCPTool(toolUseBlock.name, toolUseBlock.input);

                    currentMessages.push({
                        role: 'assistant',
                        content: claudeResponse.content
                    });

                    currentMessages.push({
                        role: 'user',
                        content: [{
                            type: 'tool_result',
                            tool_use_id: toolUseBlock.id,
                            content: toolResult.content[0].text
                        }]
                    });
                } else {
                    shouldContinue = false;
                }
            } else {
                res.json(claudeResponse);
                shouldContinue = false;
            }
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Client server running on http://0.0.0.0:${PORT}`);
    console.log(`MCP Server URL: ${MCP_SERVER_URL}`);
});
