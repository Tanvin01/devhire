import NextAuth from 'next-auth'
import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GithubProvider from 'next-auth/providers/github'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      role: string
      image?: string
    }
  }
  interface User {
    id: string
    role: string
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        // In production, look up user in database and verify password hash
        // const user = await prisma.user.findUnique({ where: { email: credentials.email } })
        // if (!user) return null
        // const valid = await bcrypt.compare(credentials.password, user.passwordHash)
        // if (!valid) return null

        // Mock auth for portfolio demo
        if (credentials.email === 'demo@devhire.io' && credentials.password === 'Demo1234!') {
          return {
            id: 'usr_demo',
            name: 'Demo User',
            email: credentials.email,
            role: 'SEEKER',
          }
        }
        return null
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
