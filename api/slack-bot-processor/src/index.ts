import 'dotenv/config'
import { App, LogLevel } from '@slack/bolt'
import { registerHandlers } from './handlers/index.js'

// Import processors to register them
import './processors/index.js'

// Validate required environment variables
const requiredEnvVars = ['SLACK_BOT_TOKEN', 'SLACK_APP_TOKEN', 'SLACK_SIGNING_SECRET']
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`)
    console.error('Copy .env.example to .env and fill in your Slack credentials')
    process.exit(1)
  }
}

// Initialize Bolt app with Socket Mode
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  logLevel: process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
})

// Register all handlers
registerHandlers(app)

// Start the app
async function main() {
  const port = parseInt(process.env.PORT || '3000', 10)
  await app.start(port)
  console.log('⚡️ Slack Bot Processor is running!')
  console.log(`   Mode: Socket Mode (no public URL required)`)
  console.log(`   Port: ${port} (for health checks)`)
}

main().catch((error) => {
  console.error('Failed to start app:', error)
  process.exit(1)
})
