// components/PRDetails.tsx
import { GitPullRequest, Edit3, Send, ExternalLink, CheckCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'

interface PRDetailsProps {
  prTitle: string
  prDescription: string
  loading: boolean
  createdPrUrl: string
  onTitleChange: (title: string) => void
  onDescriptionChange: (description: string) => void
  onCreatePR: () => void
}

export default function PRDetails({
  prTitle,
  prDescription,
  loading,
  createdPrUrl,
  onTitleChange,
  onDescriptionChange,
  onCreatePR,
}: PRDetailsProps) {
  if (!prDescription) return null

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Edit3 className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Pull Request Details</CardTitle>
            <CardDescription>Review and customize your PR</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* PR Title */}
        <div className="space-y-2">
          <Label htmlFor="pr-title">PR Title</Label>
          <Input
            id="pr-title"
            value={prTitle}
            onChange={e => onTitleChange(e.target.value)}
            placeholder="Enter a descriptive title for your PR..."
          />
        </div>

        {/* Generated Description */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="pr-description">Generated Description</Label>
            <Badge variant="secondary" className="text-xs">
              AI Generated
            </Badge>
          </div>
          <Textarea
            id="pr-description"
            value={prDescription}
            onChange={e => onDescriptionChange(e.target.value)}
            rows={14}
            className="font-mono text-sm resize-none"
            placeholder="Generated description will appear here..."
          />
          <p className="text-xs text-muted-foreground">
            You can edit the description above to match your preferences
          </p>
        </div>

        {/* Create PR Button */}
        <Button
          onClick={onCreatePR}
          disabled={!prTitle || !prDescription || loading}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating PR...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Create Pull Request
            </>
          )}
        </Button>

        {/* Success Message */}
        {createdPrUrl && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-semibold">Pull request created successfully!</p>
                <p className="text-sm text-muted-foreground">
                  Your PR has been submitted for review
                </p>
                <a
                  href={createdPrUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  <GitPullRequest className="h-3 w-3" />
                  View on GitHub
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
