// components/Header.tsx
import { signOut, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { GitPullRequest, LogOut } from 'lucide-react'
import { analytics } from '@/lib/analytics'

export default function Header() {
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GitPullRequest className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold">DevFlow</h1>
              <p className="text-xs text-muted-foreground">PR Description Generator</p>
            </div>
          </div>

          {/* User Info & Actions */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || ''} />
                <AvatarFallback>
                  {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">{session?.user?.name}</p>
                <p className="text-xs text-muted-foreground">Developer</p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                analytics.userSignedOut()
                signOut()
              }}
            >
              <LogOut className="h-4 w-4" />
              <span className="ml-2 hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
