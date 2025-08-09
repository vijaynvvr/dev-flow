import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { X, Settings, Key } from 'lucide-react'

interface SettingsBannerProps {
  className?: string
  onDismiss?: () => void
}

export default function SettingsBanner({ className = '', onDismiss }: SettingsBannerProps) {
  const [dismissed, setDismissed] = useState(false)
  const router = useRouter()

  const handleDismiss = () => {
    setDismissed(true)
    onDismiss?.()
  }

  const handleGoToSettings = () => {
    router.push('/settings')
  }

  if (dismissed) return null

  return (
    <Alert className={`flex border-primary/20 bg-primary/5 ${className}`}>
      <div className="w-full flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Key className="h-3 w-3" />
            </div>
            <h3 className="font-semibold">Unlock Full Access</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0 cursor-pointer"
            onClick={handleDismiss}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
        <AlertDescription className="text-xs">
              • Connect your GitHub PAT for seamless access to private/organization repositories<br />
              • Configure your Gemini API key for uninterrupted AI assistance<br />
              • Your API keys are encrypted and stored securely
        </AlertDescription>
        <Button size="sm" onClick={handleGoToSettings} className="h-8 text-xs">
          <Settings className="h-2 w-2" />
          Configure Settings
        </Button>
      </div>
    </Alert>
  )
}
