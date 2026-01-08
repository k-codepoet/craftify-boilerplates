import type { App } from '@slack/bolt'
import { getSupportedTypes } from '../processors/index.js'

/**
 * Register message handlers
 *
 * Example handlers for app mentions and direct messages.
 * Customize these for your use case.
 */
export function registerMessageHandlers(app: App): void {
  // Respond to app mentions
  app.event('app_mention', async ({ event, client, logger }) => {
    try {
      const supportedTypes = getSupportedTypes()

      await client.chat.postMessage({
        channel: event.channel,
        thread_ts: event.ts,
        text: `Hi! I'm a file processor bot. Upload a file and I'll process it for you.\n\n*Supported file types:*\n${supportedTypes}`,
      })
    } catch (error) {
      logger.error('Error responding to mention:', error)
    }
  })

  // Example: React to specific keywords in messages
  app.message(/help|지원|도움/, async ({ message, client, logger }) => {
    try {
      // Type guard for message with channel
      if (!('channel' in message)) return

      const supportedTypes = getSupportedTypes()

      await client.chat.postMessage({
        channel: message.channel,
        thread_ts: 'ts' in message ? message.ts : undefined,
        text: `*Supported file types:*\n${supportedTypes}\n\nJust upload a file and I'll process it automatically!`,
      })
    } catch (error) {
      logger.error('Error sending help:', error)
    }
  })
}
