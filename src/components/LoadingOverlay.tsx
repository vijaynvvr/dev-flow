// components/LoadingOverlay.tsx
import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

interface LoadingOverlayProps {
  isVisible: boolean
  title: string
  description: string
  icon?: React.ReactNode
}

export default function LoadingOverlay({ 
  isVisible, 
  title, 
  description, 
  icon 
}: LoadingOverlayProps) {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center p-8">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
            {icon || <Loader2 className="h-8 w-8 animate-spin" />}
          </div>
          <h3 className="mb-2 text-lg font-semibold">{title}</h3>
          <p className="text-center text-sm text-muted-foreground">
            {description}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}