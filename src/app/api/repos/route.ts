import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { Octokit } from '@octokit/rest'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const octokit = new Octokit({
      auth: session.accessToken,
    })

    const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
      sort: 'updated',
      per_page: 100,
    })

    const reposData = repos.map(repo => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      owner: repo.owner.login,
      private: repo.private,
      description: repo.description,
      updated_at: repo.updated_at,
    }))

    return NextResponse.json(reposData)
  } catch (error) {
    console.error('Error fetching repos:', error)
    return NextResponse.json({ error: 'Failed to fetch repositories' }, { status: 500 })
  }
}
