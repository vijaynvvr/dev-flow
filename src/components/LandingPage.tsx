// components/LandingPage.tsx
import { signIn } from 'next-auth/react'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Github, GitPullRequest, Sparkles, Zap, Shield, ArrowRight, Loader2, Star, Users, Clock } from 'lucide-react'
import LoadingOverlay from './LoadingOverlay'

export default function LandingPage() {
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [currentText, setCurrentText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  const phrases = useMemo(() => [
    'Perfect PR Descriptions',
    'Professional Code Reviews',
    'Intelligent Commit Analysis',
    'Automated Documentation',
    'Better Team Collaboration'
  ], []);

  const handleSignIn = async () => {
    if (isSigningIn) return // Prevent multiple clicks
    
    try {
      setIsSigningIn(true)
      await signIn('github')
    } catch (error) {
      console.error('Sign in error:', error)
      setIsSigningIn(false) // Reset on error
    }
    // Note: Don't reset isSigningIn on success as user will be redirected
  }

  // Typing animation effect
  useEffect(() => {
    const currentPhrase = phrases[currentIndex]
    const typingSpeed = isDeleting ? 50 : 100
    const pauseTime = isDeleting ? 500 : 2000

    const timeout = setTimeout(() => {
      if (!isDeleting && currentText === currentPhrase) {
        // Finished typing, start deleting after pause
        setTimeout(() => setIsDeleting(true), pauseTime)
      } else if (isDeleting && currentText === '') {
        // Finished deleting, move to next phrase
        setIsDeleting(false)
        setCurrentIndex((prev) => (prev + 1) % phrases.length)
      } else {
        // Continue typing or deleting
        setCurrentText(prev => 
          isDeleting 
            ? prev.slice(0, -1)
            : currentPhrase.slice(0, prev.length + 1)
        )
      }
    }, typingSpeed)

    return () => clearTimeout(timeout)
  }, [currentText, currentIndex, isDeleting, phrases]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="">
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <GitPullRequest className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold">DevFlow</span>
            </div>
            <Button
              onClick={handleSignIn}
              variant="outline"
              disabled={isSigningIn}
            >
              {isSigningIn ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <Github className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center">
          <div className="mx-auto max-w-4xl">
            {/* Badge */}
            <Badge variant="secondary" className="mb-8 px-4 py-2">
              <Sparkles className="mr-2 h-4 w-4" />
              AI-Powered Developer Tools
            </Badge>

            {/* Main Headline with Typing Animation */}
            <h1 className="mb-8 flex flex-col gap-2 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              <span className="text-foreground">Generate{' '}</span>
              <span className="bg-gradient-to-r from-primary via-purple-500 to-blue-600 bg-clip-text text-transparent">
                {currentText}
              </span>
              <span className="text-foreground">in Seconds</span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mb-8 max-w-3xl text-xl text-muted-foreground leading-relaxed">
              Stop writing boring PR descriptions. Our AI analyzes your code changes, commit
              messages, and generates professional pull request descriptions that your team will
              love.
            </p>

            {/* Social Proof */}
            <div className="mb-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>Trusted by developers</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Save 30+ min per PR</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Growing community</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                onClick={handleSignIn}
                className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={isSigningIn}
              >
                {isSigningIn ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Connecting to GitHub...
                  </>
                ) : (
                  <>
                    <Github className="mr-2 h-5 w-5" />
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </div>

            {/* Demo Preview */}
            <Card className="mx-auto max-w-4xl shadow-2xl border-0 bg-gradient-to-br from-card to-muted/50">
              <CardContent className="p-6">
                <div className="rounded-lg bg-muted/80 p-6 backdrop-blur-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-red-400 shadow-sm"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-400 shadow-sm"></div>
                    <div className="h-3 w-3 rounded-full bg-green-400 shadow-sm"></div>
                    <span className="ml-4 text-sm text-muted-foreground font-medium">
                      PR Description Generator
                    </span>
                  </div>
                  <div className="rounded-lg bg-background p-6 font-mono text-sm shadow-inner border">
                    <div className="mb-2 text-muted-foreground font-semibold"># 🚀 Features</div>
                    <div className="mb-4 text-green-600">- Added user authentication system</div>
                    <div className="mb-2 text-muted-foreground font-semibold"># 🛠 Fixes</div>
                    <div className="mb-4 text-blue-600">- Fixed pagination bug in user list</div>
                    <div className="mb-2 text-muted-foreground font-semibold"># 📝 Docs</div>
                    <div className="text-purple-600">- Updated API documentation</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-4xl font-bold">Why Developers Love DevFlow</h2>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground leading-relaxed">
              Save hours every week with intelligent automation that understands your code
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-b from-card to-muted/20">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-primary to-blue-600 text-primary-foreground shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl">Lightning Fast</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center leading-relaxed">
                  Generate comprehensive PR descriptions in under 10 seconds. No more staring at
                  blank description boxes.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-b from-card to-muted/20">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-primary to-purple-600 text-primary-foreground shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl">AI-Powered</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center leading-relaxed">
                  Advanced AI analyzes your code diff, commit messages, and file changes to create
                  meaningful descriptions.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-b from-card to-muted/20">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-primary to-green-600 text-primary-foreground shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl">Secure & Private</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center leading-relaxed">
                  Your code never leaves GitHub. We only analyze diffs through secure OAuth
                  integration.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-4xl font-bold">How It Works</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">Simple 3-step process to better PRs</p>
          </div>

          <div className="grid gap-12 md:grid-cols-3">
            <div className="text-center group">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-primary to-blue-600 text-xl font-bold text-primary-foreground shadow-lg group-hover:scale-110 transition-transform duration-300">
                1
              </div>
              <h3 className="mb-4 text-xl font-semibold">Connect GitHub</h3>
              <p className="text-muted-foreground leading-relaxed">
                Sign in with your GitHub account and select your repository
              </p>
            </div>
            <div className="text-center group">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-primary to-purple-600 text-xl font-bold text-primary-foreground shadow-lg group-hover:scale-110 transition-transform duration-300">
                2
              </div>
              <h3 className="mb-4 text-xl font-semibold">Choose Branches</h3>
              <p className="text-muted-foreground leading-relaxed">
                Select your base and target branches to analyze the changes
              </p>
            </div>
            <div className="text-center group">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-primary to-green-600 text-xl font-bold text-primary-foreground shadow-lg group-hover:scale-110 transition-transform duration-300">
                3
              </div>
              <h3 className="mb-4 text-xl font-semibold">Generate & Create</h3>
              <p className="text-muted-foreground leading-relaxed">
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
            onClick={handleSignIn}
            className="text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all duration-300"
            disabled={isSigningIn}
          >
            {isSigningIn ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Starting Your Journey...
              </>
            ) : (
              <>
                <Github className="mr-2 h-5 w-5" />
                Start Free Now
              </>
            )}
          </Button>
        </div>
      </section>

      {/* Loading Overlay for Sign In */}
      <LoadingOverlay
        isVisible={isSigningIn}
        title="Connecting to GitHub"
        description="Please wait while we redirect you to GitHub for secure authentication..."
        icon={<Github className="h-8 w-8" />}
      />

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