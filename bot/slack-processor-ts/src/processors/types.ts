/**
 * Processor input with file data and metadata
 */
export interface ProcessorInput {
  /** Original filename */
  filename: string
  /** MIME type */
  mimetype: string
  /** File extension (without dot) */
  extension: string
  /** Raw file buffer */
  buffer: Buffer
  /** Slack user who uploaded */
  userId: string
  /** Channel where file was shared */
  channelId: string
  /** Thread timestamp (if in thread) */
  threadTs?: string
}

/**
 * Processor output - what to send back to Slack
 */
export interface ProcessorOutput {
  /** Text message to send */
  text?: string
  /** Blocks for rich formatting */
  blocks?: unknown[]
  /** File to upload back to Slack */
  file?: {
    buffer: Buffer
    filename: string
    title?: string
  }
  /** Whether to reply in thread */
  replyInThread?: boolean
}

/**
 * Processor function signature
 */
export type Processor = (input: ProcessorInput) => Promise<ProcessorOutput | null>

/**
 * Processor registry entry
 */
export interface ProcessorEntry {
  /** File extensions this processor handles (e.g., ['pdf', 'docx']) */
  extensions: string[]
  /** MIME types this processor handles */
  mimetypes?: string[]
  /** Processor function */
  process: Processor
  /** Description for help text */
  description: string
}
