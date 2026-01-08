import type { App } from '@slack/bolt'
import { registerFileHandler } from './file.js'
import { registerMessageHandlers } from './message.js'

/**
 * Register all event handlers
 */
export function registerHandlers(app: App): void {
  registerFileHandler(app)
  registerMessageHandlers(app)

  // Add your custom handlers here:
  // registerCustomHandler(app)
}
