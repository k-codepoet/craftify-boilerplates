/**
 * Cloudflare Workers environment bindings
 */
export type Bindings = {
  DB: D1Database
  SLACK_BOT_TOKEN: string
  SLACK_SIGNING_SECRET: string
}

/**
 * Slack Event API payload
 * @see https://api.slack.com/events
 */
export type SlackEventPayload = {
  type: string
  challenge?: string
  token?: string
  team_id?: string
  api_app_id?: string
  event?: SlackEvent
  event_id?: string
  event_time?: number
}

/**
 * Base Slack event
 */
export type SlackEvent = {
  type: string
  user?: string
  channel?: string
  ts?: string
  event_ts?: string
}

/**
 * file_shared event
 * @see https://api.slack.com/events/file_shared
 */
export type FileSharedEvent = SlackEvent & {
  type: 'file_shared'
  file_id: string
  channel_id: string
  user_id: string
}

/**
 * message event
 * @see https://api.slack.com/events/message
 */
export type MessageEvent = SlackEvent & {
  type: 'message'
  subtype?: string
  text?: string
  thread_ts?: string
  channel_type?: string
}

/**
 * app_mention event
 * @see https://api.slack.com/events/app_mention
 */
export type AppMentionEvent = SlackEvent & {
  type: 'app_mention'
  text: string
  channel: string
  thread_ts?: string
}

/**
 * Slack files.info API response
 */
export type SlackFileInfo = {
  ok: boolean
  file: {
    id: string
    name: string
    title: string
    filetype: string
    mimetype: string
    size: number
    url_private: string
    url_private_download: string
    permalink: string
    shares?: {
      public?: Record<string, Array<{ ts: string; thread_ts?: string }>>
      private?: Record<string, Array<{ ts: string; thread_ts?: string }>>
    }
  }
  error?: string
}

/**
 * Slack users.info API response
 */
export type SlackUserInfo = {
  ok: boolean
  user?: {
    id: string
    name: string
    real_name: string
    profile: {
      display_name: string
      image_48: string
    }
  }
  error?: string
}

/**
 * Slack conversations.replies API response
 */
export type SlackConversationReplies = {
  ok: boolean
  messages?: Array<{
    type: string
    user: string
    text: string
    ts: string
    thread_ts?: string
  }>
  error?: string
}

/**
 * Slack chat.postMessage API response
 */
export type SlackPostMessageResponse = {
  ok: boolean
  channel?: string
  ts?: string
  message?: {
    text: string
    ts: string
  }
  error?: string
}

/**
 * Event handler function type
 */
export type EventHandler<T extends SlackEvent = SlackEvent> = (
  event: T,
  env: Bindings
) => Promise<void>
