const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

let conversationHistory = [];

function addMessage(role, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = role === 'user' ? 'U' : 'C';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = content;

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message assistant';
    loadingDiv.id = 'loading-indicator';

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = 'C';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.innerHTML = '<span></span><span></span><span></span>';

    contentDiv.appendChild(loading);
    loadingDiv.appendChild(avatar);
    loadingDiv.appendChild(contentDiv);
    chatMessages.appendChild(loadingDiv);

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideLoading() {
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.remove();
    }
}

async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;

    addMessage('user', message);
    messageInput.value = '';
    sendButton.disabled = true;

    conversationHistory.push({
        role: 'user',
        content: message
    });

    showLoading();

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: conversationHistory
            })
        });

        hideLoading();

        if (!response.ok) {
            const error = await response.json();
            addMessage('assistant', `Error: ${error.error || 'Unknown error occurred'}`);
            return;
        }

        const data = await response.json();

        const textContent = data.content
            .filter(block => block.type === 'text')
            .map(block => block.text)
            .join('\n');

        if (textContent) {
            addMessage('assistant', textContent);
            conversationHistory.push({
                role: 'assistant',
                content: textContent
            });
        }
    } catch (error) {
        hideLoading();
        addMessage('assistant', `Error: ${error.message}`);
    } finally {
        sendButton.disabled = false;
        messageInput.focus();
    }
}

sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

messageInput.focus();
