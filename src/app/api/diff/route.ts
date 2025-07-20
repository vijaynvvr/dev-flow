// app/api/diff/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { Octokit } from '@octokit/rest'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { owner, repo, baseBranch, targetBranch } = await request.json()

    if (!owner || !repo || !baseBranch || !targetBranch) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    const octokit = new Octokit({
      auth: session.accessToken,
    })

    // Get the comparison between branches
    const { data: comparison } = await octokit.rest.repos.compareCommitsWithBasehead({
      owner,
      repo,
      basehead: `${baseBranch}...${targetBranch}`,
    })

    // Extract file changes
    const fileChanges =
      comparison.files?.map(file => ({
        filename: file.filename,
        status: file.status,
        additions: file.additions,
        deletions: file.deletions,
        changes: file.changes,
        patch: file.patch,
      })) || []

    // Generate PR description using Gemini Flash (higher free tier limits)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `
Analyze the following git diff and generate a PR description using this exact format:

🚀 Features
🛠 Fixes
🧼 Refactors
🧹 Clean-up
📝 Docs / Chores

For each section, list the relevant changes. If a section has no changes, omit it entirely.

Here are the file changes:
${fileChanges
  .map(
    file => `
File: ${file.filename}
Status: ${file.status}
Changes: +${file.additions} -${file.deletions}
${file.patch ? `Patch:\n${file.patch.slice(0, 1000)}${file.patch.length > 1000 ? '...' : ''}` : ''}
`
  )
  .join('\n---\n')}

Please categorize each change appropriately and provide clear, concise descriptions. Focus on what the change accomplishes rather than the technical implementation details.
`

    try {
      const result = await model.generateContent(prompt)
      const prDescription = result.response.text()

      return NextResponse.json({
        description: prDescription,
        fileChanges,
        stats: {
          totalFiles: comparison.files?.length || 0,
          totalAdditions: comparison.files?.reduce((sum, file) => sum + file.additions, 0) || 0,
          totalDeletions: comparison.files?.reduce((sum, file) => sum + file.deletions, 0) || 0,
          commits: comparison.commits?.length || 0,
        },
      })
    } catch (aiError: unknown) {
      console.error('AI Generation Error:', aiError)

      // Check if it's a rate limit error
      if (aiError && typeof aiError === 'object' && 'message' in aiError) {
        const errorMessage = String(aiError.message)
        if (errorMessage.includes('429') || errorMessage.includes('quota')) {
          return NextResponse.json(
            {
              error:
                'AI service temporarily unavailable due to rate limits. Please try again in a few minutes.',
              fallback: true,
            },
            { status: 429 }
          )
        }
      }

      // Return a fallback description if AI fails
      const fallbackDescription = `
🚀 Features
${
  fileChanges
    .filter(f => f.status === 'added')
    .map(f => `- Added ${f.filename}`)
    .join('\n') || '- No new features'
}

🛠 Fixes
${
  fileChanges
    .filter(f => f.status === 'modified' && f.filename.includes('fix'))
    .map(f => `- Updated ${f.filename}`)
    .join('\n') || '- No fixes identified'
}

🧼 Refactors
${
  fileChanges
    .filter(f => f.status === 'modified' && !f.filename.includes('fix'))
    .slice(0, 3)
    .map(f => `- Refactored ${f.filename}`)
    .join('\n') || '- No refactors identified'
}

📝 Docs / Chores
${
  fileChanges
    .filter(f => f.filename.includes('README') || f.filename.includes('.md'))
    .map(f => `- Updated ${f.filename}`)
    .join('\n') || '- No documentation changes'
}
      `.trim()

      return NextResponse.json({
        description: fallbackDescription,
        fileChanges,
        stats: {
          totalFiles: comparison.files?.length || 0,
          totalAdditions: comparison.files?.reduce((sum, file) => sum + file.additions, 0) || 0,
          totalDeletions: comparison.files?.reduce((sum, file) => sum + file.deletions, 0) || 0,
          commits: comparison.commits?.length || 0,
        },
        fallback: true,
      })
    }
  } catch (error) {
    console.error('Error generating diff:', error)
    return NextResponse.json({ error: 'Failed to generate diff analysis' }, { status: 500 })
  }
}
