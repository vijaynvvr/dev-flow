const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const gitFiles = new Set(
  execSync('git ls-files --cached --others --exclude-standard', { encoding: 'utf8' })
    .split('\n')
    .filter(Boolean)
)

function printTree(dir, base = dir, prefix = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true }).filter(entry => {
    const relativePath = path.relative(base, path.join(dir, entry.name))
    return gitFiles.has(relativePath) || [...gitFiles].some(f => f.startsWith(relativePath + '/'))
  })

  entries.forEach((entry, index) => {
    const isLast = index === entries.length - 1
    const connector = isLast ? '└── ' : '├── '
    const nextPrefix = prefix + (isLast ? '    ' : '│   ')
    const fullPath = path.join(dir, entry.name)
    const relativePath = path.relative(base, fullPath)

    console.log(prefix + connector + entry.name)

    if (entry.isDirectory()) {
      printTree(fullPath, base, nextPrefix)
    }
  })
}

printTree(process.cwd())
