import type { App } from '@slack/bolt'
import { processFile } from '../processors/index.js'
import type { ProcessorInput } from '../processors/types.js'
import { shouldSkipFile } from '../lib/guards.js'

interface FileSharedEventData {
  file_id: string
  channel_id: string
  user_id: string
  event_ts: string
}

/**
 * Register file_shared event handler
 *
 * Triggered when a file is uploaded to a channel where the bot is present.
 * Downloads the file, processes it, and sends the result back.
 */
export function registerFileHandler(app: App): void {
  app.event('file_shared', async ({ event, client, logger, context }) => {
    const fileEvent = event as unknown as FileSharedEventData

    try {
      // Get file info
      const fileInfo = await client.files.info({ file: fileEvent.file_id })

      if (!fileInfo.ok || !fileInfo.file) {
        logger.error('Failed to get file info')
        return
      }

      const file = fileInfo.file

      // Check skip conditions (bot uploads, patterns, size limits, etc.)
      const skipResult = shouldSkipFile({
        fileUserId: file.user,
        botUserId: context.botUserId,
        filename: file.name,
        fileSize: file.size,
        mimetype: file.mimetype,
      })

      if (skipResult.skip) {
        logger.debug(`Skipping file: ${skipResult.reason}`)
        return
      }

      // Skip if no private URL (can't download)
      if (!file.url_private) {
        logger.warn('File has no private URL, skipping')
        return
      }

      // Download file content
      const response = await fetch(file.url_private, {
        headers: {
          Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
        },
      })

      if (!response.ok) {
        logger.error(`Failed to download file: ${response.status}`)
        return
      }

      const buffer = Buffer.from(await response.arrayBuffer())

      // Get thread_ts from file shares
      const shares = file.shares?.public || file.shares?.private || {}
      const channelShares = shares[fileEvent.channel_id] || []
      const threadTs = channelShares[0]?.ts

      // Prepare processor input
      const input: ProcessorInput = {
        filename: file.name || 'unknown',
        mimetype: file.mimetype || 'application/octet-stream',
        extension: (file.name || '').split('.').pop()?.toLowerCase() || '',
        buffer,
        userId: fileEvent.user_id,
        channelId: fileEvent.channel_id,
        threadTs,
      }

      // Process the file
      const output = await processFile(input)

      if (!output) {
        // No processor found for this file type
        return
      }

      // Send response back to Slack
      const messageOptions: Record<string, unknown> = {
        channel: fileEvent.channel_id,
      }

      if (output.replyInThread && threadTs) {
        messageOptions.thread_ts = threadTs
      }

      // Upload file if processor returned one
      if (output.file) {
        // Build upload arguments conditionally
        const baseArgs = {
          channel_id: fileEvent.channel_id,
          file: output.file.buffer,
          filename: output.file.filename,
          title: output.file.title,
          initial_comment: output.text,
        }

        if (output.replyInThread && threadTs) {
          await client.files.uploadV2({ ...baseArgs, thread_ts: threadTs })
        } else {
          await client.files.uploadV2(baseArgs)
        }
      } else if (output.text) {
        // Just send text message
        await client.chat.postMessage({
          ...messageOptions,
          text: output.text,
          blocks: output.blocks,
        } as Parameters<typeof client.chat.postMessage>[0])
      }

      logger.info(`Processed file: ${file.name}`)
    } catch (error) {
      logger.error('Error processing file:', error)
    }
  })
}
