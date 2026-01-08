import { nanoid } from 'nanoid'

/**
 * Generate a short unique ID
 * @param length - ID length (default: 10)
 */
export function generateId(length = 10): string {
  return nanoid(length)
}

/**
 * Escape HTML characters for safe rendering
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * Build Slack deep link URL
 * @param channelId - Slack channel ID
 * @param messageTs - Message timestamp (optional, for specific message)
 * @param teamId - Team ID (optional)
 */
export function buildSlackLink(
  channelId: string,
  messageTs?: string,
  teamId?: string
): string {
  const params = new URLSearchParams()
  if (teamId) params.set('team', teamId)
  params.set('id', channelId)
  if (messageTs) params.set('message', messageTs)
  return `slack://channel?${params.toString()}`
}

/**
 * Parse Slack message timestamp to Date
 */
export function parseSlackTs(ts: string): Date {
  const [seconds] = ts.split('.')
  return new Date(parseInt(seconds) * 1000)
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return date.toISOString().replace('T', ' ').slice(0, 19)
}
