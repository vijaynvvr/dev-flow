import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { Octokit } from '@octokit/rest'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { owner, repo, title, body, head, base } = await request.json()

    if (!owner || !repo || !title || !body || !head || !base) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    const octokit = new Octokit({
      auth: session.accessToken,
    })

    const { data: pr } = await octokit.rest.pulls.create({
      owner,
      repo,
      title,
      body,
      head,
      base,
    })

    return NextResponse.json({
      url: pr.html_url,
      number: pr.number,
      id: pr.id,
    })
  } catch (error: unknown) {
    console.error('Error creating PR:', error)

    if (error && typeof error === 'object' && 'status' in error && error.status === 422) {
      return NextResponse.json(
        {
          error: 'No commits between branches or PR already exists',
        },
        { status: 422 }
      )
    }

    return NextResponse.json({ error: 'Failed to create pull request' }, { status: 500 })
  }
}
