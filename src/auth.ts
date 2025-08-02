import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import { saveUserSettings } from './lib/settings'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: {
          scope: 'read:user user:email repo',
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider === 'github') {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      return session
    },
    async signIn({ user, account }) {
      if (account?.provider === 'github' && user.email) {
        try {
          await saveUserSettings(user.email, {
            geminiApiKey: '',
            githubPatToken: '',
          })
        } catch (error) {
          console.error('Error creating user settings on sign-in:', error)
        }
      }
      return true
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
})
