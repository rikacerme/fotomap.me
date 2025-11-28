import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.join(__dirname, '..')

// Try multiple possible locations for face-api.js weights
const possiblePaths = [
  path.join(projectRoot, 'node_modules', 'face-api.js', 'weights'),
  path.join(projectRoot, 'node_modules', 'face-api.js', 'dist', 'weights'),
  path.join(projectRoot, 'node_modules', '@vladmandic', 'face-api', 'dist', 'weights'),
  path.join(projectRoot, 'node_modules', '@vladmandic', 'face-api', 'model'),
]

const destDir = path.join(projectRoot, 'public', 'models')

// Find source directory
let sourceDir = null
for (const possiblePath of possiblePaths) {
  if (fs.existsSync(possiblePath)) {
    sourceDir = possiblePath
    break
  }
}

// Create destination directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true })
}

// Copy model files if source found
if (sourceDir) {
  try {
    const files = fs.readdirSync(sourceDir)
    let copiedCount = 0

    files.forEach((file) => {
      const sourceFile = path.join(sourceDir, file)
      const destFile = path.join(destDir, file)
      
      if (fs.statSync(sourceFile).isFile()) {
        fs.copyFileSync(sourceFile, destFile)
        copiedCount++
      }
    })

    console.log(`✓ Setup complete! Copied ${copiedCount} model files to ${destDir}`)
  } catch (error) {
    console.warn(`⚠ Warning: Could not copy model files: ${error.message}`)
    console.warn('Using CDN fallback for models (https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/)')
  }
} else {
  console.log('✓ No local models found - using CDN fallback')
  console.log('  Models will be loaded from: https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/')
  console.log('  (This is normal and requires internet connection)')
}
