// app/page.tsx
'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

// Components
import LandingPage from '@/components/LandingPage'
import Header from '@/components/Header'
import RepositorySelector from '@/components/RepositorySelector'
import DiffStats from '@/components/DiffStats'
import PRDetails from '@/components/PRDetails'

interface Repository {
  id: number
  name: string
  full_name: string
  owner: string
  private: boolean
  description: string
  updated_at: string
}

interface Branch {
  name: string
  sha: string
  protected: boolean
}

interface DiffStatsType {
  totalFiles: number
  totalAdditions: number
  totalDeletions: number
  commits: number
}

export default function Home() {
  const { data: session, status } = useSession()
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null)
  const [branches, setBranches] = useState<Branch[]>([])
  const [baseBranch, setBaseBranch] = useState('')
  const [targetBranch, setTargetBranch] = useState('')
  const [prDescription, setPrDescription] = useState('')
  const [prTitle, setPrTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [diffStats, setDiffStats] = useState<DiffStatsType | null>(null)
  const [createdPrUrl, setCreatedPrUrl] = useState('')

  // Fetch repositories
  const fetchRepositories = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/repos')
      if (response.ok) {
        const repos = await response.json()
        setRepositories(repos)
      }
    } catch (error) {
      console.error('Error fetching repositories:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch branches for selected repository
  const fetchBranches = async (owner: string, repo: string) => {
    try {
      const response = await fetch(`/api/branches?owner=${owner}&repo=${repo}`)
      if (response.ok) {
        const branchData = await response.json()
        setBranches(branchData)
        // Set default base branch to main/master if available
        const defaultBranch = branchData.find(
          (b: Branch) => b.name === 'main' || b.name === 'master'
        )
        if (defaultBranch) {
          setBaseBranch(defaultBranch.name)
        }
      }
    } catch (error) {
      console.error('Error fetching branches:', error)
    }
  }

  // Generate PR description
  const generateDescription = async () => {
    if (!selectedRepo || !baseBranch || !targetBranch) return

    try {
      setLoading(true)

      const response = await fetch('/api/diff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          owner: selectedRepo.owner,
          repo: selectedRepo.name,
          baseBranch,
          targetBranch,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setPrDescription(result.description)
        setDiffStats(result.stats)
        if (!prTitle) {
          setPrTitle(`feat: merge ${targetBranch} into ${baseBranch}`)
        }

        // Show warning if fallback was used
        if (result.fallback) {
          alert(
            'AI service temporarily unavailable. Generated a basic description. You can edit it before creating the PR.'
          )
        }
      } else {
        const error = await response.json()

        if (response.status === 429) {
          alert(`Rate limit exceeded: ${error.error}`)
        } else {
          alert(`Error: ${error.error}`)
        }
      }
    } catch (error) {
      console.error('Error generating description:', error)
      alert('Failed to generate description')
    } finally {
      setLoading(false)
    }
  }

  // Create pull request
  const createPullRequest = async () => {
    if (!selectedRepo || !baseBranch || !targetBranch || !prTitle || !prDescription) return

    try {
      setLoading(true)
      const response = await fetch('/api/create-pr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          owner: selectedRepo.owner,
          repo: selectedRepo.name,
          title: prTitle,
          body: prDescription,
          head: targetBranch,
          base: baseBranch,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setCreatedPrUrl(result.url)
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error creating PR:', error)
      alert('Failed to create pull request')
    } finally {
      setLoading(false)
    }
  }

  // Handle repository selection
  const handleRepoSelect = (repo: Repository | null) => {
    setSelectedRepo(repo)
    setBranches([])
    setBaseBranch('')
    setTargetBranch('')
    setPrDescription('')
    setPrTitle('')
    setDiffStats(null)
    setCreatedPrUrl('')

    if (repo) {
      fetchBranches(repo.owner, repo.name)
    }
  }

  useEffect(() => {
    if (session) {
      fetchRepositories()
    }
  }, [session])

  // Loading state
  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium text-muted-foreground">Loading DevFlow...</p>
        </div>
      </div>
    )
  }

  // Show landing page if not authenticated
  if (!session) {
    return <LandingPage />
  }

  // Main application
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left Panel - Configuration */}
          <div className="space-y-6">
            <RepositorySelector
              repositories={repositories}
              selectedRepo={selectedRepo}
              branches={branches}
              baseBranch={baseBranch}
              targetBranch={targetBranch}
              loading={loading}
              onRepoSelect={handleRepoSelect}
              onBaseBranchChange={setBaseBranch}
              onTargetBranchChange={setTargetBranch}
              onRefreshRepos={fetchRepositories}
              onGenerateDescription={generateDescription}
            />

            {/* Diff Stats */}
            {diffStats && <DiffStats stats={diffStats} />}
          </div>

          {/* Right Panel - PR Details */}
          <div className="space-y-6">
            <PRDetails
              prTitle={prTitle}
              prDescription={prDescription}
              loading={loading}
              createdPrUrl={createdPrUrl}
              onTitleChange={setPrTitle}
              onDescriptionChange={setPrDescription}
              onCreatePR={createPullRequest}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
