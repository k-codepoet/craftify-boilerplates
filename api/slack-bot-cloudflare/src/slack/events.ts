import type { Context } from 'hono'
import type {
  Bindings,
  SlackEvent,
  SlackEventPayload,
  EventHandler,
} from './types'

/**
 * Event handler registry
 */
const eventHandlers = new Map<string, EventHandler>()

/**
 * Register an event handler
 *
 * @example
 * ```ts
 * registerHandler('file_shared', async (event, env) => {
 *   console.log('File shared:', event.file_id)
 * })
 * ```
 */
export function registerHandler<T extends SlackEvent>(
  eventType: string,
  handler: EventHandler<T>
) {
  eventHandlers.set(eventType, handler as EventHandler)
}

/**
 * Create the Slack events endpoint handler
 *
 * @example
 * ```ts
 * app.post('/slack/events', createEventsHandler())
 * ```
 */
export function createEventsHandler() {
  return async (c: Context<{ Bindings: Bindings }>) => {
    const body: SlackEventPayload = await c.req.json()

    // URL verification (required by Slack on initial setup)
    if (body.type === 'url_verification') {
      return c.json({ challenge: body.challenge })
    }

    // Event callback
    if (body.type === 'event_callback' && body.event) {
      const event = body.event
      const handler = eventHandlers.get(event.type)

      if (handler) {
        // Run handler in background to respond quickly to Slack
        c.executionCtx.waitUntil(
          handler(event, c.env).catch((err) => {
            console.error(`Error handling ${event.type}:`, err)
          })
        )
      }
    }

    // Always respond quickly to Slack (within 3 seconds)
    return c.json({ ok: true })
  }
}

/**
 * Verify Slack request signature (optional but recommended)
 * @see https://api.slack.com/authentication/verifying-requests-from-slack
 */
export async function verifySlackSignature(
  signingSecret: string,
  signature: string,
  timestamp: string,
  body: string
): Promise<boolean> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(signingSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const sigBaseString = `v0:${timestamp}:${body}`
  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(sigBaseString)
  )

  const expectedSignature =
    'v0=' +
    Array.from(new Uint8Array(signatureBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')

  return signature === expectedSignature
}

/**
 * Create middleware to verify Slack requests
 *
 * @example
 * ```ts
 * app.use('/slack/*', createSignatureMiddleware())
 * ```
 */
export function createSignatureMiddleware() {
  return async (
    c: Context<{ Bindings: Bindings }>,
    next: () => Promise<void>
  ) => {
    const signature = c.req.header('x-slack-signature')
    const timestamp = c.req.header('x-slack-request-timestamp')

    if (!signature || !timestamp) {
      return c.json({ error: 'Missing signature headers' }, 401)
    }

    // Check timestamp to prevent replay attacks (within 5 minutes)
    const now = Math.floor(Date.now() / 1000)
    if (Math.abs(now - parseInt(timestamp)) > 60 * 5) {
      return c.json({ error: 'Request too old' }, 401)
    }

    const body = await c.req.text()
    const isValid = await verifySlackSignature(
      c.env.SLACK_SIGNING_SECRET,
      signature,
      timestamp,
      body
    )

    if (!isValid) {
      return c.json({ error: 'Invalid signature' }, 401)
    }

    // Re-parse body for downstream handlers
    // @ts-ignore - override request body cache
    c.req.bodyCache = { text: body, json: JSON.parse(body) }

    await next()
  }
}
