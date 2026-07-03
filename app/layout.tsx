import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/shared/toaster'
import AuthProvider from '@/components/shared/AuthProvider'

export const metadata: Metadata = {
  title: 'Karang Taruna Dala Ranger 08',
  description: 'Website resmi Karang Taruna Dala Ranger 08 - Bersatu, Berkarya, Berdaya untuk Masyarakat',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Playfair+Display:ital,wght@0,700;0,800;1,700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}