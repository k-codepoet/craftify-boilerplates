import type {
  SlackFileInfo,
  SlackUserInfo,
  SlackConversationReplies,
  SlackPostMessageResponse,
} from './types'

const SLACK_API_BASE = 'https://slack.com/api'

/**
 * Get file information
 * @see https://api.slack.com/methods/files.info
 */
export async function getFileInfo(
  token: string,
  fileId: string
): Promise<SlackFileInfo> {
  const res = await fetch(`${SLACK_API_BASE}/files.info?file=${fileId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.json()
}

/**
 * Download file content from private URL
 */
export async function downloadFile(
  token: string,
  url: string
): Promise<string> {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.text()
}

/**
 * Get user information
 * @see https://api.slack.com/methods/users.info
 */
export async function getUserInfo(
  token: string,
  userId: string
): Promise<SlackUserInfo> {
  const res = await fetch(`${SLACK_API_BASE}/users.info?user=${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.json()
}

/**
 * Get conversation replies (thread messages)
 * @see https://api.slack.com/methods/conversations.replies
 */
export async function getConversationReplies(
  token: string,
  channel: string,
  threadTs: string
): Promise<SlackConversationReplies> {
  const res = await fetch(
    `${SLACK_API_BASE}/conversations.replies?channel=${channel}&ts=${threadTs}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return res.json()
}

/**
 * Post a message to a channel or thread
 * @see https://api.slack.com/methods/chat.postMessage
 */
export async function postMessage(
  token: string,
  options: {
    channel: string
    text: string
    thread_ts?: string
    unfurl_links?: boolean
    unfurl_media?: boolean
    blocks?: unknown[]
  }
): Promise<SlackPostMessageResponse> {
  const res = await fetch(`${SLACK_API_BASE}/chat.postMessage`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      unfurl_links: false,
      ...options,
    }),
  })
  return res.json()
}

/**
 * Post an ephemeral message (only visible to one user)
 * @see https://api.slack.com/methods/chat.postEphemeral
 */
export async function postEphemeral(
  token: string,
  options: {
    channel: string
    user: string
    text: string
    thread_ts?: string
    blocks?: unknown[]
  }
): Promise<SlackPostMessageResponse> {
  const res = await fetch(`${SLACK_API_BASE}/chat.postEphemeral`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(options),
  })
  return res.json()
}

/**
 * Add a reaction to a message
 * @see https://api.slack.com/methods/reactions.add
 */
export async function addReaction(
  token: string,
  options: {
    channel: string
    timestamp: string
    name: string // emoji name without colons
  }
): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch(`${SLACK_API_BASE}/reactions.add`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(options),
  })
  return res.json()
}

/**
 * Open a modal view
 * @see https://api.slack.com/methods/views.open
 */
export async function openView(
  token: string,
  options: {
    trigger_id: string
    view: unknown
  }
): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch(`${SLACK_API_BASE}/views.open`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(options),
  })
  return res.json()
}
