
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { userSettings } from '@/lib/utils'

export async function GET() {
  const session = await auth()
  
  if (!session || !session.user?.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const userEmail = session.user.email
  const settings = userSettings.get(userEmail) || { geminiApiKey: '', githubPatToken: '' }

  return NextResponse.json(settings)
}

export async function POST(request: NextRequest) {
  const session = await auth()
  
  if (!session || !session.user?.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const userEmail = session.user.email
    const { geminiApiKey, githubPatToken } = await request.json()

    if (geminiApiKey && typeof geminiApiKey !== 'string') {
      return NextResponse.json({ message: 'Invalid Gemini API key format' }, { status: 400 })
    }

    if (githubPatToken && typeof githubPatToken !== 'string') {
      return NextResponse.json({ message: 'Invalid GitHub PAT token format' }, { status: 400 })
    }

    // Store the user settings
    userSettings.set(userEmail, {
      geminiApiKey: geminiApiKey || '',
      githubPatToken: githubPatToken || '',
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving settings:', error)
    return NextResponse.json({ message: 'Failed to save settings' }, { status: 500 })
  }
}
