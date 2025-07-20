// components/RepositorySelector.tsx
import { RefreshCw, GitBranch, Database, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

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

interface RepositorySelectorProps {
  repositories: Repository[]
  selectedRepo: Repository | null
  branches: Branch[]
  baseBranch: string
  targetBranch: string
  loading: boolean
  onRepoSelect: (repo: Repository | null) => void
  onBaseBranchChange: (branch: string) => void
  onTargetBranchChange: (branch: string) => void
  onRefreshRepos: () => void
  onGenerateDescription: () => void
}

export default function RepositorySelector({
  repositories,
  selectedRepo,
  branches,
  baseBranch,
  targetBranch,
  loading,
  onRepoSelect,
  onBaseBranchChange,
  onTargetBranchChange,
  onRefreshRepos,
  onGenerateDescription,
}: RepositorySelectorProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Repository Setup</CardTitle>
            <CardDescription>Choose your repository and branches</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Repository Selection */}
        <div className="space-y-2">
          <Label htmlFor="repository">Repository</Label>
          <div className="flex gap-2">
            <Select
              value={selectedRepo?.id.toString() || ''}
              onValueChange={value => {
                const repo = repositories.find(r => r.id === parseInt(value))
                onRepoSelect(repo || null)
              }}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a repository..." />
              </SelectTrigger>
              <SelectContent>
                {repositories.map(repo => (
                  <SelectItem key={repo.id} value={repo.id.toString()}>
                    {repo.full_name} {repo.private ? '🔒' : '🌐'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={onRefreshRepos} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          {selectedRepo?.description && (
            <p className="text-sm text-muted-foreground">{selectedRepo.description}</p>
          )}
        </div>

        {/* Branch Selection */}
        {selectedRepo && (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="base-branch">Base Branch</Label>
                <Select value={baseBranch} onValueChange={onBaseBranchChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select base branch..." />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map(branch => (
                      <SelectItem key={branch.name} value={branch.name}>
                        {branch.name} {branch.protected ? '🛡️' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="target-branch">Target Branch</Label>
                <Select value={targetBranch} onValueChange={onTargetBranchChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select target branch..." />
                  </SelectTrigger>
                  <SelectContent>
                    {branches
                      .filter(b => b.name !== baseBranch)
                      .map(branch => (
                        <SelectItem key={branch.name} value={branch.name}>
                          {branch.name} {branch.protected ? '🛡️' : ''}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={onGenerateDescription}
              disabled={!baseBranch || !targetBranch || loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Changes...
                </>
              ) : (
                <>
                  <GitBranch className="mr-2 h-4 w-4" />
                  Generate PR Description
                </>
              )}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
