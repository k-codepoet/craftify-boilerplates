import pdf from 'pdf-parse'
import mammoth from 'mammoth'
import { registerProcessor } from './registry.js'
import type { ProcessorInput, ProcessorOutput } from './types.js'

/**
 * PDF processor - extract text from PDFs
 */
async function processPdf(input: ProcessorInput): Promise<ProcessorOutput> {
  const data = await pdf(input.buffer)

  const preview = data.text.slice(0, 1000)
  const truncated = data.text.length > 1000 ? '...(truncated)' : ''

  return {
    text: `*PDF Extracted: ${input.filename}*\nPages: ${data.numpages}\n\n\`\`\`\n${preview}${truncated}\n\`\`\``,
    replyInThread: true,
  }
}

/**
 * Word document processor - extract text from .docx
 */
async function processDocx(input: ProcessorInput): Promise<ProcessorOutput> {
  const result = await mammoth.extractRawText({ buffer: input.buffer })

  const preview = result.value.slice(0, 1000)
  const truncated = result.value.length > 1000 ? '...(truncated)' : ''

  return {
    text: `*Document Extracted: ${input.filename}*\n\n\`\`\`\n${preview}${truncated}\n\`\`\``,
    replyInThread: true,
  }
}

// Register PDF processor
registerProcessor({
  extensions: ['pdf'],
  mimetypes: ['application/pdf'],
  process: processPdf,
  description: 'Extract text from PDF files',
})

// Register Word document processor
registerProcessor({
  extensions: ['docx'],
  mimetypes: [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  process: processDocx,
  description: 'Extract text from Word documents',
})
