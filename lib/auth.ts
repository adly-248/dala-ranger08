import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google' // 🌟 TAMBAHAN
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'
import { DefaultSession } from "next-auth"

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET || "rahasia-super-aman-123",
  pages: {
    signIn: '/login', // 🌟 Diarahkan ke halaman login kustom kamu
    error: '/login',
  },
  providers: [
    // 🔵 PROVIDER 1: Login Google
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    
    // 🟢 PROVIDER 2: Login Email & Password Lama
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
        
        // Return data user + pangkat
        return { 
          id: user.id, 
          email: user.email, 
          name: user.name, 
          role: user.role,
          pangkat: user.pangkat || 'Anggota Aktif'
        }
      },
    }),
  ],
  callbacks: {
    // 🔒 1. VALIDASI SIGN IN (Khusus akun Google)
    async signIn({ user, account }) {
      // Jika user mencoba login lewat Google, cek dulu di database
      if (account?.provider === 'google') {
        if (!user.email) return false

        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        })

        // Jika email Google belum didaftarkan oleh admin, TOLAK AKSES
        if (!existingUser) {
          return false 
        }
      }
      return true // Akun credentials atau Google yang terdaftar lolos
    },

    // 🔑 2. TOKEN JWT
    async jwt({ token, user, account }) {
      // Jika proses login baru berhasil dilakukan
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.pangkat = (user as any).pangkat
      } 
      // Jika login lewat Google, suntik ulang data role & pangkat dari DB
      else if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email }
        })
        if (dbUser) {
          token.id = dbUser.id
          token.role = dbUser.role
          token.pangkat = dbUser.pangkat
        }
      }
      return token
    },

    // 🔑 3. SESSION WEB
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string
        (session.user as any).role = token.role as string;
        (session.user as any).pangkat = token.pangkat as string
      }
      return session
    },
  },
})

// 🌟 TYPE DECLARATION (Menjaga agar TypeScript tidak merah)
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      pangkat: string
    } & DefaultSession["user"]
  }

  interface User {
    role: string
    pangkat?: string | null
  }
}