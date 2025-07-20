'use client'

import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Github, GitPullRequest } from 'lucide-react'

export default function SignIn() {
  const router = useRouter()

  useEffect(() => {
    getSession().then(session => {
      if (session) {
        router.push('/')
      }
    })
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-blue-100 rounded-full">
            <GitPullRequest className="h-12 w-12 text-blue-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
        <p className="text-gray-600 mb-8">
          Sign in to continue generating intelligent PR descriptions
        </p>

        <button
          onClick={() => signIn('github', { callbackUrl: '/' })}
          className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-3 font-medium"
        >
          <Github className="h-5 w-5" />
          Continue with GitHub
        </button>

        <div className="mt-8 text-sm text-gray-500">
          <p>By signing in, you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </div>
    </div>
  )
}
