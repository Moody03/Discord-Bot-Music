# Discord Music Bot
*Created by 0xkhass - All Rights Reserved*

A complete, secure Discord Music Bot with YouTube and Spotify support, built with Node.js and Discord.js v14.

## 🎵 Features

- **Multi-Platform Support**: YouTube direct playback + Spotify (via YouTube fallback)
- **Full Music Controls**: Play, pause, resume, skip, stop, queue management
- **Advanced Features**: Volume control, loop modes, shuffle, queue pagination
- **High-Quality Audio**: Uses @discordjs/voice for optimal streaming
- **Secure**: Environment variables, no token exposure, proper error handling
- **Modern**: Discord.js v14 with slash commands
- **Free**: Only uses open-source packages

## 🚀 Commands

| Command | Description |
|---------|-------------|
| `/play <query>` | Play from YouTube URL, search, or Spotify URL/playlist |
| `/pause` | Pause current song |
| `/resume` | Resume paused song |
| `/skip` | Skip current song |
| `/stop` | Stop music and clear queue |
| `/queue [page]` | Show queue (paginated) |
| `/nowplaying` | Show current song info |
| `/volume [level]` | Set/check volume (0-100) |
| `/loop <mode>` | Set loop mode (off/song/queue) |
| `/shuffle` | Shuffle queue |
| `/clear` | Clear queue |

## 📋 Prerequisites

- Node.js 16.9.0 or higher
- Discord Bot Token
- Spotify Client ID & Secret (optional, for Spotify support)

## 🔧 Setup Instructions

### Method 1: Local Development (Cursor IDE)

1. **Clone/Download the project**
   ```bash
   git clone <your-repo-url>
   cd discord-music-bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   - Copy `.env.example` to `.env`
   - Fill in your tokens:
   ```env
   DISCORD_TOKEN=your_discord_bot_token_here
   SPOTIFY_CLIENT_ID=your_spotify_client_id_here
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
   ```

4. **Run the bot**
   ```bash
   npm start
   # Or for development with auto-reload:
   npm run dev
   ```

### Method 2: Replit Deployment

1. **Prepare GitHub Repository**
   - Create private GitHub repo
   - Upload all files (`.env` will be handled in Replit)
   - Ensure `.gitignore` excludes `.env`

2. **Import to Replit**
   - Go to Replit.com
   - Click "Import from GitHub"
   - Select your repository

3. **Configure Replit Secrets**
   - Open your Replit project
   - Go to "Secrets" tab (lock icon)
   - Add your environment variables:
     - `DISCORD_TOKEN`: Your Discord bot token
     - `SPOTIFY_CLIENT_ID`: Your Spotify client ID
     - `SPOTIFY_CLIENT_SECRET`: Your Spotify client secret

4. **Run the bot**
   - Click the "Run" button in Replit
   - Bot will automatically start and register commands

### 🤖 Discord Bot Setup

1. **Create Discord Application**
   - Go to https://discord.com/developers/applications
   - Click "New Application"
   - Give it a name and create

2. **Create Bot User**
   - Go to "Bot" section
   - Click "Add Bot"
   - Copy the token (this is your `DISCORD_TOKEN`)

3. **Set Bot Permissions**
   - In "Bot" section, enable these intents:
     - Message Content Intent
   - In "OAuth2 > URL Generator":
     - Scopes: `bot`, `applications.commands`
     - Bot Permissions: 
       - Send Messages
       - Use Slash Commands
       - Connect
       - Speak
       - Use Voice Activity

4. **Invite Bot to Server**
   - Use the generated OAuth2 URL
   - Select your server and authorize

### 🎵 Spotify Setup (Optional)

1. **Create Spotify App**
   - Go to https://developer.spotify.com/dashboard
   - Click "Create an App"
   - Fill in details (redirect URI not needed)

2. **Get Credentials**
   - Copy Client ID and Client Secret
   - Add to your `.env` file

> **Note**: Spotify tracks are converted to YouTube searches automatically. Bot works without Spotify credentials (YouTube only).

## 🛡️ Security Features

- ✅ Environment variables for all secrets
- ✅ No token logging or exposure
- ✅ Proper `.gitignore` configuration
- ✅ Input validation and error handling
- ✅ Rate limiting considerations
- ✅ Memory-efficient queue management

## 🔧 Troubleshooting

### Common Issues

**Bot doesn't respond to commands**
- Ensure bot has proper permissions in your server
- Check that bot is online (green status)
- Verify slash commands are registered (check console logs)

**Audio issues**
- Ensure bot has "Connect" and "Speak" permissions
- Check if voice channel has user limit restrictions
- Verify Node.js version (16.9.0+ required)

**Spotify not working**
- Bot will fallback to YouTube-only mode
- Check Spotify credentials in environment variables
- Ensure Spotify app is properly configured

**Replit deployment issues**
- Verify all secrets are properly set in Replit Secrets tab
- Check that `replit.nix` and `.replit` files are present
- Monitor console for any missing dependencies

### Performance Tips

- Use UptimeRobot or similar to keep Replit instance alive
- Monitor memory usage for large queues
- Consider upgrading Replit plan for better performance

## 📝 License

```
Discord Music Bot
Created by 0xkhass - All Rights Reserved
Free to use, not for resale or republish
```

## 🆘 Support

For issues and questions:
1. Check troubleshooting section above
2. Review console logs for error details
3. Ensure all prerequisites are met
4. Verify bot permissions in Discord server

---

**⚠️ Important Security Reminders:**
- Never commit your `.env` file
- Never share your Discord bot token
- Keep your GitHub repository private if it contains sensitive data
- Regularly rotate your API keys for security

## 🔄 Keeping Bot Alive (Replit)

Add this to your Replit project to prevent it from sleeping:

1. **Create a simple ping endpoint** (optional):
   Add to your `index.js`:
   ```javascript
   // Simple HTTP server to keep Replit alive
   const express = require('express');
   const app = express();
   app.get('/', (req, res) => res.send('Bot is running!'));
   app.listen(3000);
   ```

2. **Add express to dependencies**:
   ```bash
   npm install express
   ```

3. **Use UptimeRobot** (free):
   - Sign up at https://uptimerobot.com
   - Add your Replit URL as a monitor
   - Set check interval to 5 minutes

This keeps your bot running 24/7 on Replit's free tier.