# Discord Webhook Manager

A powerful and user-friendly Discord webhook management application built with Next.js.

## Features

- 🔐 **Discord OAuth Authentication** - Secure login with Discord
- 📨 **Custom Webhook Messages** - Send rich embeds with custom colors and avatars
- 📊 **Analytics & History** - Track webhook delivery and success rates
- 👥 **User Management** - Admin panel with user controls and blocking
- 🌓 **Dark/Light Theme** - Toggle between themes with system preference detection
- 📱 **Mobile Responsive** - Works perfectly on all devices
- ⚡ **Real-time Updates** - Live webhook status and delivery confirmation

## Setup Instructions

### 1. Clone the Repository
\`\`\`bash
git clone <repository-url>
cd discord-webhook-app
npm install
\`\`\`

### 2. Create Discord Application
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Go to "OAuth2" → "General"
4. Copy your Client ID and Client Secret
5. Add redirect URI: `http://localhost:3000/api/auth/callback/discord`

### 3. Environment Variables
Create a `.env.local` file in the root directory:

\`\`\`env
# Discord OAuth
DISCORD_CLIENT_ID=your_discord_client_id_here
DISCORD_CLIENT_SECRET=your_discord_client_secret_here

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Database (optional - for production)
DATABASE_URL=your_database_url_here
\`\`\`

### 4. Generate NextAuth Secret
\`\`\`bash
# Generate a random secret
openssl rand -base64 32
\`\`\`

### 5. Run the Application
\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` to see the application.

## Admin Setup

The first user with Discord ID `808641359006400512` will automatically have admin privileges. To change this:

1. Update the admin ID in the code
2. Or modify the database/localStorage admin settings

## Production Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Update `NEXTAUTH_URL` to your production domain
5. Update Discord OAuth redirect URI to your production domain

### Environment Variables for Production
\`\`\`env
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
NEXTAUTH_SECRET=your_production_secret
NEXTAUTH_URL=https://your-domain.vercel.app
\`\`\`

## Features Overview

### For Users
- Send custom webhook messages with embeds
- Track message history and delivery status
- Manage multiple webhook URLs
- Dark/Light theme support

### For Admins
- User management and blocking
- System analytics and statistics
- Webhook usage monitoring
- Admin-only controls

## Security Features

- Discord OAuth integration
- User blocking and access control
- Admin privilege management
- Secure session handling

## Technologies Used

- **Frontend**: Next.js 15, React 18, TypeScript
- **Authentication**: NextAuth.js with Discord provider
- **Styling**: Tailwind CSS, shadcn/ui components
- **Icons**: Lucide React
- **Animations**: Framer Motion

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For support, join our Discord server or create an issue on GitHub.

---

Made with ❤️ by [eqwzzx](https://eqwzzx.fun)
