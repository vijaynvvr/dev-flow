// components/LandingPage.tsx
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Github, GitPullRequest, Sparkles, Zap, Shield, ArrowRight } from 'lucide-react'
import { analytics } from '@/lib/analytics'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <GitPullRequest className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold">DevFlow</span>
            </div>
            <Button
              onClick={() => {
                analytics.userSignedIn({ provider: 'github' })

                signIn('github')
              }}
              variant="outline"
            >
              <Github className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center">
          <div className="mx-auto max-w-4xl">
            {/* Badge */}
            <Badge variant="secondary" className="mb-8">
              <Sparkles className="mr-2 h-4 w-4" />
              AI-Powered Developer Tools
            </Badge>

            {/* Main Headline */}
            <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl">
              Generate Perfect
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                {' '}
                PR Descriptions
              </span>
              <br />
              in Seconds
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mb-12 max-w-3xl text-xl text-muted-foreground">
              Stop writing boring PR descriptions. Our AI analyzes your code changes, commit
              messages, and generates professional pull request descriptions that your team will
              love.
            </p>

            {/* CTA Buttons */}
            <div className="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                onClick={() => {
                  analytics.userSignedIn({
                    provider: 'github',
                  })
                  signIn('github')
                }}
                className="text-lg"
              >
                <Github className="mr-2 h-5 w-5" />
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              {/* <Button size="lg" variant="outline" className="text-lg">
                <GitPullRequest className="mr-2 h-5 w-5" />
                View Demo
              </Button> */}
            </div>

            {/* Demo Preview */}
            <Card className="mx-auto max-w-4xl">
              <CardContent className="p-6">
                <div className="rounded-lg bg-muted p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-red-400"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                    <div className="h-3 w-3 rounded-full bg-green-400"></div>
                    <span className="ml-4 text-sm text-muted-foreground">
                      PR Description Generator
                    </span>
                  </div>
                  <div className="rounded-lg bg-background p-6 font-mono text-sm">
                    <div className="mb-2 text-muted-foreground"># 🚀 Features</div>
                    <div className="mb-4">- Added user authentication system</div>
                    <div className="mb-2 text-muted-foreground"># 🛠 Fixes</div>
                    <div className="mb-4">- Fixed pagination bug in user list</div>
                    <div className="mb-2 text-muted-foreground"># 📝 Docs</div>
                    <div>- Updated API documentation</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold">Why Developers Love DevFlow</h2>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
              Save hours every week with intelligent automation that understands your code
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Zap className="h-8 w-8" />
                </div>
                <CardTitle>Lightning Fast</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Generate comprehensive PR descriptions in under 10 seconds. No more staring at
                  blank description boxes.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Sparkles className="h-8 w-8" />
                </div>
                <CardTitle>AI-Powered</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Advanced AI analyzes your code diff, commit messages, and file changes to create
                  meaningful descriptions.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Shield className="h-8 w-8" />
                </div>
                <CardTitle>Secure & Private</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Your code never leaves GitHub. We only analyze diffs through secure OAuth
                  integration.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold">How It Works</h2>
            <p className="text-xl text-muted-foreground">Simple 3-step process to better PRs</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-lg font-bold text-primary-foreground">
                1
              </div>
              <h3 className="mb-2 text-xl font-semibold">Connect GitHub</h3>
              <p className="text-muted-foreground">
                Sign in with your GitHub account and select your repository
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-lg font-bold text-primary-foreground">
                2
              </div>
              <h3 className="mb-2 text-xl font-semibold">Choose Branches</h3>
              <p className="text-muted-foreground">
                Select your base and target branches to analyze the changes
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-lg font-bold text-primary-foreground">
                3
              </div>
              <h3 className="mb-2 text-xl font-semibold">Generate & Create</h3>
              <p className="text-muted-foreground">
                AI creates the description and you can create the PR instantly
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-24 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-4xl font-bold">Ready to Write Better PRs?</h2>
          <p className="mb-8 text-xl opacity-90">
            Join thousands of developers who save time with AI-generated PR descriptions
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => {
              analytics.userSignedIn({ provider: 'github' })
              signIn('github')
            }}
            className="text-lg"
          >
            <Github className="mr-2 h-5 w-5" />
            Start Free Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-8 sm:flex-row items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <GitPullRequest className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold">DevFlow</span>
            </div>
            <p className="text-muted-foreground">Created by Vijay with ❤️ for developers</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
