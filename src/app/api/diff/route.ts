import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { Octokit } from '@octokit/rest'
import { getUserSettings } from '@/lib/settings'
import { buildPrompt, fallbackAlgo, generateWithFallback } from '@/lib/llm'

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

    const { owner, repo, baseBranch, currentBranch, mode = 'patch', format = 'detailed' } = await request.json()    

    if (!owner || !repo || !baseBranch || !currentBranch) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    const octokit = new Octokit({ auth: accessToken })
    const { data: comparison } = await octokit.rest.repos.compareCommitsWithBasehead({
      owner,
      repo,
      basehead: `${baseBranch}...${currentBranch}`,
    })

    const files = comparison.files || []
    const commits = comparison.commits || []

    let description = ''
    let fallback = false
    let usedPrompt: string | null = null


    if (mode === 'algo') {
      description = fallbackAlgo(files)
    } else {
      const prompt = buildPrompt(
        mode === 'commit' ? commits : files,
        mode,
        format
      )
      usedPrompt = prompt
      const result = await generateWithFallback({
        apiKey: GEMINI_API_KEY!,
        prompt,
      })
      if (result.text) {
        description = result.text
      } else {
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
      prompt: fallback ? usedPrompt : null,
    })
  } catch (error) {
    console.error('Diff generation failed:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
