import { Hono } from 'hono'
import type { Bindings, FileSharedEvent, MessageEvent } from './slack/types'
import { registerHandler, createEventsHandler } from './slack/events'
import { getFileInfo, postMessage, getUserInfo } from './slack/api'
import { generateId } from './lib/utils'

const app = new Hono<{ Bindings: Bindings }>()

// =============================================================================
// Event Handlers
// Register your event handlers here
// =============================================================================

/**
 * Example: file_shared event handler
 * Triggered when a file is shared in a channel where the bot is present
 */
registerHandler<FileSharedEvent>('file_shared', async (event, env) => {
  const { file_id, channel_id } = event

  // Get file info
  const fileInfo = await getFileInfo(env.SLACK_BOT_TOKEN, file_id)
  if (!fileInfo.ok) {
    console.error('Failed to get file info:', fileInfo.error)
    return
  }

  const file = fileInfo.file

  // Example: Only process certain file types
  // if (!file.name.endsWith('.md')) return

  // Save to database
  const docId = generateId()
  await env.DB.prepare(
    `INSERT INTO documents (id, filename, slack_channel_id, slack_file_id)
     VALUES (?, ?, ?, ?)`
  ).bind(docId, file.name, channel_id, file_id).run()

  // Get the thread_ts from file shares
  const shares = file.shares?.public || file.shares?.private || {}
  const channelShares = shares[channel_id] || []
  const thread_ts = channelShares[0]?.ts

  // Reply to thread
  await postMessage(env.SLACK_BOT_TOKEN, {
    channel: channel_id,
    thread_ts,
    text: `File received: ${file.name} (ID: ${docId})`,
  })
})

/**
 * Example: message event handler
 * Triggered when a message is posted in a channel where the bot is present
 * Requires channels:history or groups:history scope
 */
registerHandler<MessageEvent>('message', async (event, env) => {
  // Ignore bot messages to prevent loops
  if (event.subtype === 'bot_message') return

  // Example: Echo messages that mention the bot
  // Add your custom logic here
  console.log('Message received:', event.text)
})

// =============================================================================
// Routes
// =============================================================================

// Health check
app.get('/', (c) => {
  return c.text('Slack Bot is running!')
})

// Slack events endpoint
app.post('/slack/events', createEventsHandler())

// Example: Dynamic content page
app.get('/view/:id', async (c) => {
  const id = c.req.param('id')

  const doc = await c.env.DB.prepare(
    'SELECT * FROM documents WHERE id = ?'
  ).bind(id).first<{ id: string; filename: string; created_at: string }>()

  if (!doc) {
    return c.html('<h1>Not Found</h1>', 404)
  }

  return c.html(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${doc.filename}</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            font-family: system-ui, sans-serif;
          }
        </style>
      </head>
      <body>
        <h1>${doc.filename}</h1>
        <p>Created: ${doc.created_at}</p>
      </body>
    </html>
  `)
})

export default app
