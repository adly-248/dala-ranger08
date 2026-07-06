import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'
import { DefaultSession } from 'next-auth'

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET || 'rahasia-super-aman-dala-ranger-123',
  pages: {
    signIn: '/login-admin',
    error: '/login-admin',
  },
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })
        if (!user || !user.password) return null
        const valid = await bcrypt.compare(credentials.password as string, user.password)
        if (!valid) return null
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          pangkat: user.pangkat || 'Anggota Aktif',
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        if (!user.email) return false
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        })
        if (!existingUser) return false
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.pangkat = (user as any).pangkat
      } else if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
        })
        if (dbUser) {
          token.id = dbUser.id
          token.role = dbUser.role
          token.pangkat = dbUser.pangkat
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        ;(session.user as any).id = token.id as string
        ;(session.user as any).role = token.role as string
        ;(session.user as any).pangkat = token.pangkat as string
      }
      return session
    },
  },
})

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
      pangkat: string
    } & DefaultSession['user']
  }
  interface User {
    role: string
    pangkat?: string | null
  }
}