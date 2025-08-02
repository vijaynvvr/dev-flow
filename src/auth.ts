import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import { createEmptyUserSettings } from './lib/settings'

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
  session: {
    maxAge: 24 * 60 * 60, // 1 day in seconds
  },
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
          await createEmptyUserSettings(user.email)
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
