import type { ProcessorEntry, ProcessorInput, ProcessorOutput } from './types.js'

/**
 * Processor registry - maps file types to processors
 */
const processors: ProcessorEntry[] = []

/**
 * Register a processor
 */
export function registerProcessor(entry: ProcessorEntry): void {
  processors.push(entry)
  console.log(`[Processor] Registered: ${entry.description} (${entry.extensions.join(', ')})`)
}

/**
 * Find processor for a given file
 */
export function findProcessor(
  filename: string,
  mimetype: string
): ProcessorEntry | undefined {
  const ext = filename.split('.').pop()?.toLowerCase() || ''

  return processors.find(
    (p) =>
      p.extensions.includes(ext) ||
      (p.mimetypes && p.mimetypes.includes(mimetype))
  )
}

/**
 * Process a file through the appropriate processor
 */
export async function processFile(
  input: ProcessorInput
): Promise<ProcessorOutput | null> {
  const processor = findProcessor(input.filename, input.mimetype)

  if (!processor) {
    console.log(`[Processor] No processor found for: ${input.filename}`)
    return null
  }

  console.log(`[Processor] Processing ${input.filename} with: ${processor.description}`)
  return processor.process(input)
}

/**
 * Get list of supported file types for help message
 */
export function getSupportedTypes(): string {
  return processors
    .map((p) => `• ${p.extensions.join(', ')}: ${p.description}`)
    .join('\n')
}
