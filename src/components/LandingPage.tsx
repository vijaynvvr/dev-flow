// components/LandingPage.tsx
import { signIn } from 'next-auth/react'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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

      {/* Features Section - Redesigned with horizontal cards */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <Badge variant="outline" className="mb-4 px-4 py-2 text-primary border-primary/20 bg-primary/5">
              <Zap className="mr-2 h-4 w-4" />
              Key Features
            </Badge>
            <h2 className="mb-6 text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Why Developers Love DevFlow
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground leading-relaxed">
              Save hours every week with intelligent automation that understands your code
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {/* Feature 1 - Horizontal Layout */}
            <div className="group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
                      <Zap className="h-10 w-10" />
                    </div>
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-3 text-slate-800 dark:text-slate-100">Lightning Fast</h3>
                  <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                    Generate comprehensive PR descriptions in under 10 seconds. No more staring at blank description boxes—our AI understands your code changes instantly.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 - Horizontal Layout */}
            <div className="group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
              <div className="flex flex-col md:flex-row-reverse items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg">
                      <Sparkles className="h-10 w-10" />
                    </div>
                  </div>
                </div>
                <div className="flex-1 text-center md:text-right">
                  <h3 className="text-2xl font-bold mb-3 text-slate-800 dark:text-slate-100">AI-Powered Intelligence</h3>
                  <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                    Advanced AI analyzes your code diff, commit messages, and file changes to create meaningful, context-aware descriptions that capture the essence of your work.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3 - Horizontal Layout */}
            <div className="group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg">
                      <Shield className="h-10 w-10" />
                    </div>
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-3 text-slate-800 dark:text-slate-100">Secure & Private</h3>
                  <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                    Your code never leaves GitHub. We only analyze diffs through secure OAuth integration, ensuring your intellectual property remains completely protected.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works - Redesigned with timeline/flow style */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <Badge variant="secondary" className="mb-4 px-4 py-2">
              <ArrowRight className="mr-2 h-4 w-4" />
              Process
            </Badge>
            <h2 className="mb-6 text-4xl font-bold">How It Works</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">Simple 3-step process to better PRs</p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="relative">
              {/* Connecting Line */}
              <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent transform -translate-y-1/2 hidden lg:block"></div>
              
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-4">
                {/* Step 1 */}
                <div className="flex-1 group relative">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-3xl p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative z-10 h-80 flex flex-col justify-center">
                    <div className="mx-auto inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-2xl font-bold mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      1
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-400">Connect GitHub</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      Sign in with GitHub and select your repository to get started
                    </p>
                    <div className="mt-6 flex justify-center">
                      <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Arrow 1 */}
                <div className="hidden lg:flex items-center justify-center">
                  <div className="bg-primary/10 rounded-full p-3">
                    <ArrowRight className="h-6 w-6 text-primary" />
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex-1 group relative">
                  <div className="bg-gradient-to-br from-primary/5 to-purple/5 border-2 border-primary/20 rounded-3xl p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative z-10 h-80 flex flex-col justify-center">
                    <div className="mx-auto inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary to-purple-600 text-white text-2xl font-bold mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      2
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Choose Branches</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      Choose your branches to analyze code changes and differences
                    </p>
                    <div className="mt-6 flex justify-center">
                      <div className="w-12 h-1 bg-gradient-to-r from-primary via-purple-500 to-transparent rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Arrow 2 */}
                <div className="hidden lg:flex items-center justify-center">
                  <div className="bg-primary/10 rounded-full p-3">
                    <ArrowRight className="h-6 w-6 text-primary" />
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex-1 group relative">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 rounded-3xl p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative z-10 h-80 flex flex-col justify-center">
                    <div className="mx-auto inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white text-2xl font-bold mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      3
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-green-700 dark:text-green-400">Generate & Create</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      AI generates perfect PR descriptions and creates them instantly
                    </p>
                    <div className="mt-6 flex justify-center">
                      <div className="w-12 h-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
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