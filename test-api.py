#!/usr/bin/env python3
import os
import json
import urllib.request
import urllib.error

# Load API key from .env
with open('.env', 'r') as f:
    for line in f:
        if line.startswith('ANTHROPIC_API_KEY'):
            api_key = line.split('=')[1].strip()
            break

print('Testing Anthropic API connection...')
print(f'API Key: {api_key[:20]}...')

def make_request(url, method='GET', data=None):
    headers = {
        'x-api-key': api_key,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
    }

    if data:
        data = json.dumps(data).encode('utf-8')

    req = urllib.request.Request(url, data=data, headers=headers, method=method)

    try:
        with urllib.request.urlopen(req) as response:
            return response.status, json.loads(response.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode('utf-8'))

# Test 1: List models
print('\n1. Trying to list available models...')
status, data = make_request('https://api.anthropic.com/v1/models')
print(f'Status: {status}')
print(f'Response: {json.dumps(data, indent=2)}')

# Test 2: Try different models
print('\n2. Testing various model IDs...')
models_to_try = [
    'claude-3-5-sonnet-20241022',
    'claude-3-5-sonnet-20240620',
    'claude-3-opus-20240229',
    'claude-3-sonnet-20240229',
    'claude-3-haiku-20240307',
    'claude-sonnet-4-5-20250929',
    'claude-3-7-sonnet-20250219'
]

working_model = None

for model in models_to_try:
    print(f'\nTesting: {model}')
    status, data = make_request(
        'https://api.anthropic.com/v1/messages',
        method='POST',
        data={
            'model': model,
            'max_tokens': 50,
            'messages': [{
                'role': 'user',
                'content': 'Say hello!'
            }]
        }
    )

    print(f'  Status: {status}')

    if status == 200:
        print(f'  ✓ SUCCESS! Response: {data["content"][0]["text"]}')
        working_model = model
        break
    else:
        print(f'  ✗ Failed: {data.get("error", {}).get("message", "Unknown error")}')

if working_model:
    print(f'\n\n✓✓✓ Working model found: {working_model} ✓✓✓')
else:
    print('\n\n✗✗✗ No working models found ✗✗✗')
    print('Your API key might not have access to these models.')
    print('Check your Anthropic console for available models.')
