// components/DiffStats.tsx
import { BarChart3, Plus, Minus, FileText, GitCommit } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface DiffStats {
  totalFiles: number
  totalAdditions: number
  totalDeletions: number
  commits: number
}

interface DiffStatsProps {
  stats: DiffStats
}

export default function DiffStats({ stats }: DiffStatsProps) {
  const totalChanges = stats.totalAdditions + stats.totalDeletions
  const additionsPercentage = totalChanges > 0 ? (stats.totalAdditions / totalChanges) * 100 : 0
  const netChange = stats.totalAdditions - stats.totalDeletions

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Change Summary</CardTitle>
            <CardDescription>Overview of modifications</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Additions */}
          <div className="rounded-lg border bg-green-50 p-4 text-center dark:bg-green-950">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Plus className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                Additions
              </span>
            </div>
            <div className="text-2xl font-bold text-green-800 dark:text-green-200">
              +{stats.totalAdditions.toLocaleString()}
            </div>
            <div className="text-xs text-green-600 dark:text-green-400">lines added</div>
          </div>

          {/* Deletions */}
          <div className="rounded-lg border bg-red-50 p-4 text-center dark:bg-red-950">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Minus className="h-4 w-4 text-red-600 dark:text-red-400" />
              <span className="text-sm font-medium text-red-700 dark:text-red-300">Deletions</span>
            </div>
            <div className="text-2xl font-bold text-red-800 dark:text-red-200">
              -{stats.totalDeletions.toLocaleString()}
            </div>
            <div className="text-xs text-red-600 dark:text-red-400">lines removed</div>
          </div>

          {/* Files Changed */}
          <div className="rounded-lg border bg-blue-50 p-4 text-center dark:bg-blue-950">
            <div className="flex items-center justify-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Files</span>
            </div>
            <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
              {stats.totalFiles.toLocaleString()}
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400">files changed</div>
          </div>

          {/* Commits */}
          <div className="rounded-lg border bg-purple-50 p-4 text-center dark:bg-purple-950">
            <div className="flex items-center justify-center gap-2 mb-2">
              <GitCommit className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Commits
              </span>
            </div>
            <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">
              {stats.commits.toLocaleString()}
            </div>
            <div className="text-xs text-purple-600 dark:text-purple-400">total commits</div>
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Net change:</span>
            <span
              className={`font-semibold ${
                netChange > 0
                  ? 'text-green-600 dark:text-green-400'
                  : netChange < 0
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-muted-foreground'
              }`}
            >
              {netChange > 0 ? '+' : ''}
              {netChange.toLocaleString()} lines
            </span>
          </div>

          {/* Visual representation */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Additions vs Deletions</span>
              <span>{additionsPercentage.toFixed(0)}% additions</span>
            </div>
            <div className="relative">
              <Progress value={additionsPercentage} className="h-2" />
              <div
                className="absolute top-0 right-0 h-2 bg-red-500 rounded-r-full"
                style={{ width: `${100 - additionsPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
