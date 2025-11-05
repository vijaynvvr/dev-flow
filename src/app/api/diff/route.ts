import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { Octokit } from '@octokit/rest'
import { components } from '@octokit/openapi-types'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { getUserSettings } from '@/lib/settings'

type GitHubFile = components['schemas']['diff-entry']
type GitHubCommit = components['schemas']['commit']
type TMode = 'patch' | 'commit' | 'algo'
type TFormat = 'simple' | 'categorized' | 'detailed'

function buildPrompt(data: GitHubFile[] | GitHubCommit[], mode: TMode, format: TFormat): string {
  // Prepare the data in a more understandable format
  const isCommitMode = mode === 'commit'
  const dataType = isCommitMode ? 'commit messages of pull request' : 'file diffs of pull request '
  const base = (mode === 'commit')
    ? (data as GitHubCommit[]).map(c => c.commit.message).join('\n')
    : (data as GitHubFile[]).map(f => `${f.status.toUpperCase()}: ${f.filename}\nChanges: +${f.additions} -${f.deletions}\n${f.patch?.slice(0, 1000) || ''}`).join('\n---\n')

  const prompts = {
    simple: `You are analyzing ${dataType}. 

Your task: Create a concise summary focusing on WHAT changed from a user/feature perspective, not technical file details.

Guidelines:
- Focus on features, functionality, and business logic changes
- Avoid listing individual files unless critical
- Group related changes together
- Use clear, non-technical language where possible
- Keep it brief

IMPORTANT: Output ONLY the PR description. Do NOT include conversational phrases like "Here's the categorization", "I've grouped", or "Based on the changes".

${dataType.toUpperCase()}:
${base}

Generate a simple bullet-point summary of the key changes.`,

    categorized: `You are analyzing ${dataType}.

Your task: Categorize changes by their PURPOSE and IMPACT, not by file types or names.

CRITICAL INSTRUCTIONS:
- Group related changes that work together to achieve a feature
- Describe changes in terms of user-facing impact or system behavior
- Describe about code based changes only if necessary to understand the context
- Avoid simply listing file names - explain what those changes accomplish
- Only include categories that have meaningful changes

Categories to use (only include relevant ones):
🚀 **New Features** - New capabilities or functionality added
🛠 **Bug Fixes** - Issues resolved or corrections made  
🔧 **Improvements** - Enhancements to existing features
♻️ **Refactoring** - Code restructuring without behavior changes
🎨 **UI/UX Changes** - Visual or user experience updates
📚 **Documentation** - README, comments, or docs updates
🧪 **Testing** - Test additions or modifications
⚙️ **Configuration** - Build, deployment, or config changes

IMPORTANT: Output ONLY the PR description. Do NOT include conversational phrases like "Here's the categorization", "I've grouped", or "Based on the changes".

${dataType.toUpperCase()}:
${base}

Analyze these changes and create a categorized description.`,

    detailed: `You are writing a comprehensive pull request description based on ${dataType}.

Your task: Create a detailed, technical PR description that thoroughly explains the changes with sufficient technical depth.

Structure your response with:

## Summary
A clear overview (2-3 sentences) of what this PR accomplishes and the problem it solves.

## Changes Made
Provide a detailed, technical breakdown of the changes:
- Specific components, functions, or modules that were modified
- New APIs, endpoints, or interfaces introduced
- Database schema changes or data model updates
- Algorithm or logic changes with technical reasoning
- Dependencies added or updated
- Technical decisions made and why

## Technical Details
- Implementation approach and patterns used
- Code organization and architectural changes
- How different parts of the code interact
- Any complex logic or algorithms worth explaining
- Error handling and edge cases addressed

## Impact & Considerations
- Which parts of the codebase are affected
- Breaking changes and migration steps required
- Performance implications with specifics
- Security considerations
- Testing approach and coverage

Focus on providing enough technical detail that another developer can understand the implementation without reading every line of code. Include specifics about what was changed and how it works.

CRITICAL: Focus on the WHAT and WHY, not the technical implementation details or file names. Write as if explaining to a product manager or team lead.

IMPORTANT: Output ONLY the PR description. Do NOT include conversational phrases like "Here's the categorization", "I've grouped", or "Based on the changes".

${dataType.toUpperCase()}:
${base}

Generate a comprehensive PR description following the structure above.`,
  }

  return prompts[format] || prompts.detailed
}

function fallbackAlgo(files: GitHubFile[]) {
  const categorized: Record<string, string[]> = {
    '🚀 New Features': [],
    '🛠 Bug Fixes': [],
    '🔧 Improvements': [],
    '♻️ Refactoring': [],
    '🎨 UI/UX Changes': [],
    '📚 Documentation': [],
    '🧪 Testing': [],
    '⚙️ Configuration': [],
    '📁 File Operations': [],
  } 

  for (const file of files) {
    const { filename, status, additions, deletions } = file
    const isNewFile = status === 'added'
    const isRemoved = status === 'removed'
    const isTest = filename.includes('.test.') || filename.includes('.spec.') || filename.includes('__tests__')
    const isConfig = filename.match(/\.(json|yml|yaml|toml|config\.)/) || filename.includes('package.json')
    const isDoc = filename.match(/\.(md|txt|rst)$/i) || filename.toLowerCase().includes('readme')
    const isUI = filename.match(/\.(css|scss|sass|less|jsx|tsx|vue|svelte)$/)

    // Smarter categorization based on context
    if (isDoc) {
      categorized['📚 Documentation'].push(`Updated documentation in ${filename}`)
    } else if (isTest) {
      categorized['🧪 Testing'].push(`${isNewFile ? 'Added' : 'Updated'} tests`)
    } else if (isConfig) {
      categorized['⚙️ Configuration'].push(`Modified configuration`)
    } else if (isRemoved) {
      categorized['♻️ Refactoring'].push(`Removed unused code`)
    } else if (isNewFile && additions > 50) {
      categorized['🚀 New Features'].push(`Added new functionality`)
    } else if (isUI) {
      categorized['🎨 UI/UX Changes'].push(`Updated user interface`)
    } else if (filename.toLowerCase().includes('fix')) {
      categorized['🛠 Bug Fixes'].push(`Fixed issues`)
    } else if (additions > deletions * 2) {
      categorized['🔧 Improvements'].push(`Enhanced existing features`)
    } else {
      categorized['♻️ Refactoring'].push(`Refactored code`)
    }
  }

  return Object.entries(categorized)
    .filter(([_, items]) => items.length > 0)
    .map(([header, items]) => {
      // Deduplicate similar items
      const uniqueItems = [...new Set(items)]
      return `### ${header}\n${uniqueItems.map(item => `- ${item}`).join('\n')}`
    })
    .join('\n\n')
    .trim()
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user?.email || !session?.accessToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const userEmail = session.user.email
    const settings = await getUserSettings(userEmail)
    const GEMINI_API_KEY = settings.geminiApiKey || process.env.GEMINI_API_KEY
    const accessToken = settings.githubPatToken || session.accessToken

    const { owner, repo, baseBranch, targetBranch, mode = 'patch', format = 'detailed' } = await request.json()    

    if (!owner || !repo || !baseBranch || !targetBranch) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    const octokit = new Octokit({ auth: accessToken })
    const { data: comparison } = await octokit.rest.repos.compareCommitsWithBasehead({
      owner,
      repo,
      basehead: `${baseBranch}...${targetBranch}`,
    })

    const files = comparison.files || []
    const commits = comparison.commits || []

    let description = ''
    let fallback = false

    if (mode === 'algo') {
      description = fallbackAlgo(files)
    } else {
      try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY!)
        const model = genAI.getGenerativeModel({ 
          model: 'gemini-2.0-flash',
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          }
        })
        const prompt = buildPrompt(mode === 'commit' ? commits : files, mode, format)
        console.log("prompt: ", prompt);
        
        const result = await model.generateContent([prompt]);
        description = result.response.text()
      } catch (e) {
        console.error('LLM failed, using fallback:', e)
        description = fallbackAlgo(files)
        fallback = true
      }
    }

    return NextResponse.json({
      description,
      stats: {
        totalFiles: files.length,
        totalAdditions: files.reduce((a, f) => a + f.additions, 0),
        totalDeletions: files.reduce((a, f) => a + f.deletions, 0),
        commits: commits.length,
      },
      fallback,
    })
  } catch (error) {
    console.error('Diff generation failed:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
