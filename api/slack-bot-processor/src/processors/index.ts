// Export types
export * from './types.js'

// Export registry functions
export { registerProcessor, findProcessor, processFile, getSupportedTypes } from './registry.js'

// Import processors to register them
import './image.js'
import './document.js'

// Add your custom processors here:
// import './custom.js'
