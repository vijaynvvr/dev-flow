import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import { userSettings } from './lib/utils'

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
      const userEmail = session.user.email;
      const settings = userSettings.get(userEmail) || { geminiApiKey: '', githubPatToken: '' }
      session.accessToken = (settings.githubPatToken || token.accessToken) as string
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
})
