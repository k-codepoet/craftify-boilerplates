import sharp from 'sharp'
import { registerProcessor } from './registry.js'
import type { ProcessorInput, ProcessorOutput } from './types.js'

/**
 * Image processor - resize, crop, convert images
 *
 * Customize this for your needs:
 * - Thumbnail generation
 * - Format conversion
 * - Watermarking
 * - Compression
 */
async function processImage(input: ProcessorInput): Promise<ProcessorOutput> {
  const image = sharp(input.buffer)
  const metadata = await image.metadata()

  // Example: Create a resized version (max 800px width)
  const resized = await image
    .resize({ width: 800, withoutEnlargement: true })
    .toBuffer()

  // Example: Also create a thumbnail
  const thumbnail = await sharp(input.buffer)
    .resize({ width: 200, height: 200, fit: 'cover' })
    .toBuffer()

  const baseName = input.filename.replace(/\.[^.]+$/, '')

  return {
    text: `Processed image: ${input.filename}\nOriginal: ${metadata.width}x${metadata.height}\nResized to max 800px width`,
    file: {
      buffer: resized,
      filename: `${baseName}-resized.${input.extension}`,
      title: `Resized: ${input.filename}`,
    },
    replyInThread: true,
  }
}

// Register for common image formats
registerProcessor({
  extensions: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'tiff'],
  mimetypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  process: processImage,
  description: 'Resize and optimize images',
})
