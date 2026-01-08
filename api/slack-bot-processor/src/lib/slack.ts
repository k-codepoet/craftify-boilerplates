/**
 * Slack API helper utilities
 */

/**
 * Download a file from Slack's private URL
 */
export async function downloadSlackFile(
  url: string,
  token: string
): Promise<Buffer> {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to download file: ${response.status} ${response.statusText}`)
  }

  return Buffer.from(await response.arrayBuffer())
}

/**
 * Build Slack deep link to a message
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
 * Format bytes to human readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
