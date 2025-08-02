import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RefreshCw, GitBranch, Database, Loader2, Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { TFormat, TMode } from '@/app/page'

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
  mode: TMode
  format: TFormat
  loading: boolean
  onRepoSelect: (repo: Repository | null) => void
  onBaseBranchChange: (branch: string) => void
  onTargetBranchChange: (branch: string) => void
  onModeChange: (mode: TMode) => void
  onFormatChange: (format: TFormat) => void
  onRefreshRepos: () => void
  onGenerateDescription: () => void
}

const modeOptions = [
  { 
    value: 'patch', 
    label: 'Patch Analysis', 
    description: 'Analyzes actual code changes and diffs to understand what was modified'
  },
  { 
    value: 'commit', 
    label: 'Commit Messages', 
    description: 'Uses commit messages from the branch to generate description'
  },
  { 
    value: 'algo', 
    label: 'Algorithm Based', 
    description: 'Fast offline analysis without AI - categorizes changes by file patterns'
  },
]

const formatOptions = [
  { 
    value: 'simple', 
    label: 'Simple', 
    description: 'Concise bullet points summarizing key changes'
  },
  { 
    value: 'categorized', 
    label: 'Categorized', 
    description: 'Changes grouped by type: Features, Fixes, Refactors, etc.'
  },
  { 
    value: 'detailed', 
    label: 'Detailed', 
    description: 'Comprehensive description with context and reasoning'
  },
]

export default function RepositorySelector({
  repositories,
  selectedRepo,
  branches,
  baseBranch,
  targetBranch,
  mode,
  format,
  loading,
  onRepoSelect,
  onBaseBranchChange,
  onTargetBranchChange,
  onModeChange,
  onFormatChange,
  onRefreshRepos,
  onGenerateDescription,
}: RepositorySelectorProps) {
  const [repoOpen, setRepoOpen] = useState(false)
  const [baseOpen, setBaseOpen] = useState(false)
  const [targetOpen, setTargetOpen] = useState(false)
  const [modeOpen, setModeOpen] = useState(false)
  const [formatOpen, setFormatOpen] = useState(false)

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
          <Label>Repository</Label>
          <div className="flex gap-2">
            <Popover open={repoOpen} onOpenChange={setRepoOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="flex-1 justify-between truncate"
                >
                  <span className="truncate">
                    {selectedRepo
                      ? `${selectedRepo.full_name} ${selectedRepo.private ? '🔒' : '🌐'}`
                      : 'Select a repository...'}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[600px] max-w-full p-0">
                <Command>
                  <CommandInput placeholder="Search repositories..." />
                  <CommandEmpty>No repositories found.</CommandEmpty>
                  <CommandGroup className='max-h-64 overflow-y-auto'>
                    {repositories.map(repo => (
                      <CommandItem
                        key={repo.id}
                        value={repo.full_name}
                        onSelect={() => {
                          onRepoSelect(repo)
                          setRepoOpen(false)
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            selectedRepo?.id === repo.id ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        <span className="truncate">{repo.full_name}</span>
                        {repo.private ? ' 🔒' : ' 🌐'}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Base Branch */}
              <div className="space-y-2">
                <Label>Base Branch</Label>
                <Popover open={baseOpen} onOpenChange={setBaseOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between truncate">
                      {baseBranch || 'Select base branch...'}
                      <ChevronDown className='w-4 h-4'/>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search branches..." />
                      <CommandEmpty>No branches found.</CommandEmpty>
                      <CommandGroup className='max-h-64 w-80 overflow-y-auto'>
                        {branches.map(branch => (
                          <CommandItem
                            key={branch.name}
                            value={branch.name}
                            onSelect={() => {
                              onBaseBranchChange(branch.name)
                              setBaseOpen(false)
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                baseBranch === branch.name ? 'opacity-100' : 'opacity-0'
                              )}
                            />
                            <span className="truncate">{branch.name}</span>{' '}
                            {branch.protected ? '🛡️' : ''}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Target Branch */}
              <div className="space-y-2">
                <Label>Target Branch</Label>
                <Popover open={targetOpen} onOpenChange={setTargetOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between truncate">
                      {targetBranch || 'Select target branch...'}
                      <ChevronDown className='w-4 h-4'/>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search branches..." />
                      <CommandEmpty>No branches found.</CommandEmpty>
                      <CommandGroup className='max-h-64 w-80 overflow-y-auto'>
                        {branches
                          .filter(branch => branch.name !== baseBranch)
                          .map(branch => (
                            <CommandItem
                              key={branch.name}
                              value={branch.name}
                              onSelect={() => {
                                onTargetBranchChange(branch.name)
                                setTargetOpen(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  targetBranch === branch.name ? 'opacity-100' : 'opacity-0'
                                )}
                              />
                              <span className="truncate">{branch.name}</span>{' '}
                              {branch.protected ? '🛡️' : ''}
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Analysis Options */}              
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Mode Selection */}
              <div className="space-y-2">
                <Label>Analysis Mode</Label>
                <Popover open={modeOpen} onOpenChange={setModeOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between truncate">
                      <span className="truncate">
                        {modeOptions.find(opt => opt.value === mode)?.label || 'Select mode...'}
                      </span>
                      <ChevronDown className='w-4 h-4'/>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-1" align="start">
                    <div className="space-y-1">
                      {modeOptions.map(option => (
                        <button
                          key={option.value}
                          onClick={() => {
                            onModeChange(option.value as TMode)
                            setModeOpen(false)
                          }}
                          className={cn(
                            "w-full flex items-start gap-2 px-2 py-2 text-left rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors",
                            mode === option.value && "bg-accent text-accent-foreground"
                          )}
                        >
                          <Check
                            className={cn(
                              'h-4 w-4 mt-0.5 flex-shrink-0',
                              mode === option.value ? 'opacity-100' : 'opacity-0'
                            )}
                          />
                          <div className="flex flex-col min-w-0">
                            <span className="font-medium text-sm">{option.label}</span>
                            <span className="text-xs text-muted-foreground">{option.description}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Format Selection */}
              <div className="space-y-2">
                <Label>Output Format</Label>
                <Popover open={formatOpen} onOpenChange={setFormatOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between truncate">
                      <span className="truncate">
                        {formatOptions.find(opt => opt.value === format)?.label || 'Select format...'}
                      </span>
                      <ChevronDown className='w-4 h-4'/>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-1" align="start">
                    <div className="space-y-1">
                      {formatOptions.map(option => (
                        <button
                          key={option.value}
                          onClick={() => {
                            onFormatChange(option.value as TFormat)
                            setFormatOpen(false)
                          }}
                          className={cn(
                            "w-full flex items-start gap-2 px-2 py-2 text-left rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors",
                            format === option.value && "bg-accent text-accent-foreground"
                          )}
                        >
                          <Check
                            className={cn(
                              'h-4 w-4 mt-0.5 flex-shrink-0',
                              format === option.value ? 'opacity-100' : 'opacity-0'
                            )}
                          />
                          <div className="flex flex-col min-w-0">
                            <span className="font-medium text-sm">{option.label}</span>
                            <span className="text-xs text-muted-foreground">{option.description}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={onGenerateDescription}
              disabled={!baseBranch || !targetBranch || loading}
              className="w-full"
              size="default"
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
