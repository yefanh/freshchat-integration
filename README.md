# Freshchat Bot Integration (Solvea Take-home)

A minimal Node.js/Express backend service that integrates with Freshchat webhooks. When a user sends a message, the bot automatically echoes it back.

## Features

- **Webhook Handling**: Receives real-time message events from Freshchat.
- **Auto-Reply**: Echoes the user's text back (with "Reply:" prefix).
- **Loop Prevention**: Only replies to user messages, preventing bot-to-bot loops.

## Prerequisites

- Node.js (v14 or higher)
- npm
- A Freshchat account (14-day free trial available)
- ngrok (for local development)

## Setup

1. **Install dependencies**
```bash
npm install
```

2. **Configure Environment Variables**

Create a `.env` file:
```ini
PORT=3000
FRESHCHAT_BASE_URL=https://your-domain.freshchat.com/v2
FRESHCHAT_API_KEY=your-api-key-here
```

3. **Start the Server**
```bash
npm start
```

You should see: `Server running on http://localhost:3000`

## Usage

Since Freshchat webhooks require a public URL, we use **ngrok** to create a tunnel from the internet to your local machine.

```
Freshchat → ngrok public URL → your local server (localhost:3000)
```

1. **Start ngrok**
```bash
npx ngrok http 3000
```

2. **Configure Freshchat Webhook**
   - Go to Admin Settings > Webhooks
   - Set URL to: `https://xxxx.ngrok-free.app/webhook`
   - Enable "Message Create" trigger

3. **Test**
   - Open Freshchat Live Preview widget
   - Send a message (e.g., "Hello")
   - Bot replies with "Reply:Hello"

## API Endpoint

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/webhook` | Receives Freshchat messages and sends reply |

## Project Structure

- `index.js` - Main application (server, webhook handler, reply function)
- `.env` - API keys and configuration (not committed to git)
- `package.json` - Dependencies and scripts