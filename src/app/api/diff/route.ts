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
  const base = (mode === 'commit')
    ? (data as GitHubCommit[]).map(c => c.commit.message).join('\n')
    : (data as GitHubFile[]).map(f => `File: ${f.filename}\nChanges: +${f.additions} -${f.deletions}\n${f.patch?.slice(0, 1000) || ''}`).join('\n---\n')

  const prompts = {
    simple: `Summarize the following ${mode === 'commit' ? 'commit messages' : 'code changes'} in short bullet points.\n${base}`.trim(),
    categorized: `Group the following ${mode === 'commit' ? 'commit messages' : 'diffs'} into categories:\n\n🚀 Features\n🛠 Fixes\n🧼 Refactors\n🧹 Clean-up\n📝 Docs / Chores\n\nOnly include relevant sections.\n\n${base}`.trim(),
    detailed: `Generate a detailed PR description for the following ${mode === 'commit' ? 'commit messages' : 'diffs'}.\nInclude purpose, implications, and reasoning if possible.\n\n${base}`.trim(),
  }

  return prompts[format] || prompts.detailed
}

function fallbackAlgo(files: GitHubFile[]) {
  const categorized: Record<string, string[]> = {
    '🚀 Features': [],
    '🛠 Fixes': [],
    '🧼 Refactors': [],
    '🧹 Clean-up': [],
    '📝 Docs / Chores': [],
    '📁 Renamed / Copied': [],
    '➖ Removed': [],
  } 

  for (const file of files) {
    const { filename, status } = file

    if (status === 'added') {
      categorized['🚀 Features'].push(`- Added ${filename}`)
    } else if (status === 'removed') {
      categorized['➖ Removed'].push(`- Removed ${filename}`)
    } else if (status === 'modified') {
      if (filename.includes('fix')) {
        categorized['🛠 Fixes'].push(`- Updated ${filename}`)
      } else {
        categorized['🧼 Refactors'].push(`- Modified ${filename}`)
      }
    } else if (status === 'renamed' || status === 'copied') {
      categorized['📁 Renamed / Copied'].push(`- ${status === 'renamed' ? 'Renamed' : 'Copied'} ${filename}`)
    } else if (filename.includes('README') || filename.endsWith('.md')) {
      categorized['📝 Docs / Chores'].push(`- Updated ${filename}`)
    } else {
      categorized['🧹 Clean-up'].push(`- Changed ${filename}`)
    }
  }

  return Object.entries(categorized)
    .map(([header, items]) => `${header}\n${items.join('\n') || `- No ${header.toLowerCase()}`}`)
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
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

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
