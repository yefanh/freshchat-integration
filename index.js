require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.FRESHCHAT_API_KEY;
const BASE_URL = process.env.FRESHCHAT_BASE_URL;

// Check required env vars
if (!API_KEY || !BASE_URL) {
    console.error('Error: Missing env vars. Please check your .env file.');
    process.exit(1);
}

app.use(bodyParser.json());

// Webhook: Receive messages from Freshchat
app.post('/webhook', async (req, res) => {
    try {
        const payload = req.body;
        const actor = payload.actor || {};

        // Only reply to user messages (prevent bot loop)
        if (actor.actor_type === 'user') {
            const messageData = payload.data?.message || {};
            const conversationId = messageData.conversation_id;
            const messageParts = messageData.message_parts || [];

            if (messageParts.length > 0 && messageParts[0].text) {
                const userMessage = messageParts[0].text.content;
                console.log(`Received message: "${userMessage}"`);
                await replyToFreshchat(conversationId, userMessage);
            }
        }

        res.status(200).send('OK');
    } catch (error) {
        console.error('Webhook Error:', error.message);
        res.status(500).send('Error');
    }
});

// Reply: Send a message back to Freshchat
async function replyToFreshchat(conversationId, text) {
    try {
        await axios.post(
            `${BASE_URL}/conversations/${conversationId}/messages`,
            {
                actor_type: 'bot',
                message_type: 'normal',
                message_parts: [{ text: { content: `Reply:${text}` } }]
            },
            {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log(`Sent reply: "Reply:${text}"`);
    } catch (error) {
        console.error('API Error:', error.response ? error.response.data : error.message);
    }
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Waiting for messages...');
});