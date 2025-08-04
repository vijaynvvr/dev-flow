import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { Octokit } from '@octokit/rest'
import { getUserSettings } from '@/lib/settings'

export async function GET() {
  try {
    const session = await auth()

    if (!session || !session.user?.email || !session?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userEmail = session.user.email
    const settings = await getUserSettings(userEmail)
    const accessToken = settings.githubPatToken || session.accessToken

    const octokit = new Octokit({
      auth: accessToken,
    })

    const reposData = []
    let page = 1
    let hasMore = true
    
    while (hasMore) {
      const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
        sort: 'updated',
        per_page: 100,
        page,
        affiliation: 'owner,organization_member,collaborator', // Optional: for more coverage
      })
    
      reposData.push(...repos.map(repo => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        owner: repo.owner.login,
        private: repo.private,
        description: repo.description,
        updated_at: repo.updated_at,
      })))
    
      hasMore = repos.length === 100
      page++
    }    

    return NextResponse.json(reposData)
  } catch (error) {
    console.error('Error fetching repos:', error)
    return NextResponse.json({ error: 'Failed to fetch repositories' }, { status: 500 })
  }
}
