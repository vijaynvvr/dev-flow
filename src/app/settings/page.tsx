'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Github, Key, Save, Loader2, ArrowLeft, User } from 'lucide-react'
import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [geminiApiKey, setGeminiApiKey] = useState('')
  const [githubPatToken, setGithubPatToken] = useState('')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [githubUser, setGithubUser] = useState<any>(null)
  const [githubUserLoading, setGithubUserLoading] = useState(true)
  const [settingsLoading, setSettingsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchUserSettings()
      fetchGithubUserDetails()
    }
  }, [session])

  const fetchUserSettings = async () => {
    setSettingsLoading(true)
    try {
      const response = await fetch('/api/settings')
      if (response.ok) {
        const data = await response.json()
        setGeminiApiKey(data.geminiApiKey || '')
        setGithubPatToken(data.githubPatToken || '')
      }
    } catch (error) {
      console.error('Error fetching user settings:', error)
    } finally {
      setSettingsLoading(false)
    }
  }

  const fetchGithubUserDetails = async () => {
    setGithubUserLoading(true)
    try {
      const response = await fetch('/api/github/user')
      if (response.ok) {
        const data = await response.json()
        console.log("User data: ", data);
        
        setGithubUser(data)
      }
    } catch (error) {
      console.error('Error fetching GitHub user details:', error)
    } finally {
      setGithubUserLoading(false)
    }
  }

  const saveSettings = async () => {
    setSaveSuccess(false)
    setSaveError('')
    setLoading(true)

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ geminiApiKey, githubPatToken }),
      })

      if (response.ok) {
        setSaveSuccess(true)
      } else {
        const errorData = await response.json()
        setSaveError(errorData.message || 'Failed to save settings')
      }
    } catch (error) {
      console.log("Error while saving settings: ", error);
      setSaveError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={() => router.push('/')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-lg font-bold">Settings</h1>
              <p className="text-xs text-muted-foreground">Configure your DevFlow preferences</p>
            </div>
          </div>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>GitHub Account</CardTitle>
                  <CardDescription>Your connected GitHub account details</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {githubUserLoading ? (
                <div className="flex h-40 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : githubUser ? (
                <div className="flex flex-col items-center gap-4 text-center">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={githubUser.avatar_url} alt={githubUser.login} />
                    <AvatarFallback>{githubUser.login?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{githubUser.name}</h3>
                    <p className="text-muted-foreground">@{githubUser.login}</p>
                    {githubUser.bio && (<p className="mt-2 text-sm">{githubUser.bio}</p>)}
                  </div>
                  <div className="grid w-full grid-cols-2 gap-4 text-center">
                    <div className="rounded-lg bg-muted p-3">
                      <p className="text-2xl font-bold">{githubUser.public_repos}</p>
                      <p className="text-xs text-muted-foreground">Public Repos</p>
                    </div>
                    <div className="rounded-lg bg-muted p-3">
                      <p className="text-2xl font-bold">{githubUser.followers}</p>
                      <p className="text-xs text-muted-foreground">Followers</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => window.open(githubUser.html_url, '_blank')}>
                    <Github className="mr-2 h-4 w-4" />
                    View GitHub Profile
                  </Button>
                </div>
              ) : (
                <div className="flex h-40 flex-col items-center justify-center gap-2 text-center">
                  <p className="text-muted-foreground">Unable to load GitHub profile information</p>
                  <Button variant="outline" size="sm" onClick={fetchGithubUserDetails}>
                    <Loader2 className="mr-2 h-4 w-4" />
                    Retry
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Key className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>API Keys & Tokens</CardTitle>
                  <CardDescription>Configure custom API keys for enhanced functionality</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {settingsLoading ? (
                <div className="flex h-40 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="gemini-api-key">Gemini LLM API Key</Label>
                    <Input 
                      id="gemini-api-key" 
                      type="password" 
                      placeholder="Enter your Gemini API key" 
                      value={geminiApiKey} 
                      onChange={(e) => setGeminiApiKey(e.target.value)} 
                    />
                    <p className="text-xs text-muted-foreground">
                      Provide your own Gemini API key to use Google&apos;s LLM for generating PR descriptions. 
                      <a 
                        href="https://ai.google.dev/tutorials/setup" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="ml-1 text-primary hover:underline"
                      >
                        Get a key
                      </a>
                    </p>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label htmlFor="github-pat">GitHub Personal Access Token</Label>
                    <Input 
                      id="github-pat" 
                      type="password" 
                      placeholder="Enter your GitHub PAT" 
                      value={githubPatToken} 
                      onChange={(e) => setGithubPatToken(e.target.value)} 
                    />
                    <p className="text-xs text-muted-foreground">
                      Add a GitHub Personal Access Token with &lsquo;repo&lsquo; scope to access private repositories. 
                      <a 
                        href="https://github.com/settings/tokens" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="ml-1 text-primary hover:underline"
                      >
                        Create a token
                      </a>
                    </p>
                  </div>
                  <Button className="w-full" onClick={saveSettings} disabled={loading}>
                    {loading ? (
                      <> 
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                        Saving... 
                      </>
                    ) : (
                      <> 
                        <Save className="mr-2 h-4 w-4" /> 
                        Save Settings 
                      </>
                    )}
                  </Button>
                  {saveSuccess && (
                    <Alert className="bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-300">
                      <AlertDescription>Settings saved successfully!</AlertDescription>
                    </Alert>
                  )}
                  {saveError && (
                    <Alert className="bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-300">
                      <AlertDescription>{saveError}</AlertDescription>
                    </Alert>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}