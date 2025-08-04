import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { Octokit } from '@octokit/rest'
import { getUserSettings } from '@/lib/settings'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session || !session.user?.email || !session?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const owner = searchParams.get('owner')
    const repo = searchParams.get('repo')

    if (!owner || !repo) {
      return NextResponse.json({ error: 'Owner and repo are required' }, { status: 400 })
    }

    const userEmail = session.user.email
    const settings = await getUserSettings(userEmail)
    const accessToken = settings.githubPatToken || session.accessToken

    const octokit = new Octokit({
      auth: accessToken,
    })

    const branchData = [];
    let page = 1
    let hasMore = true

    while (hasMore) {
      const { data: branches } = await octokit.rest.repos.listBranches({
        owner,
        repo,
        per_page: 100,
        page,
      })

      branchData.push(...branches.map(branch => ({
        name: branch.name,
        sha: branch.commit.sha,
        protected: branch.protected,
      })))

      hasMore = branches.length === 100
      page++
    }

    return NextResponse.json(branchData)
  } catch (error) {
    console.error('Error fetching branches:', error)
    return NextResponse.json({ error: 'Failed to fetch branches' }, { status: 500 })
  }
}
