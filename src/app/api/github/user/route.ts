import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function GET() {
  const session = await auth()
  
  if (!session || !session.accessToken) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `token ${session.accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('GitHub API error:', errorData)
      return NextResponse.json({ message: 'Failed to fetch GitHub user details' }, { status: response.status })
    }

    const userData = await response.json()
    
    return NextResponse.json(userData)
  } catch (error) {
    console.error('Error fetching GitHub user details:', error)
    return NextResponse.json({ message: 'Failed to fetch GitHub user details' }, { status: 500 })
  }
}