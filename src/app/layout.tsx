import type { Metadata } from 'next'
import { Nav } from '@/components/layout'
import { AuthProvider } from '@/components/auth'
import './globals.css'

export const metadata: Metadata = {
  title: 'Chronicles',
  description: 'A multi-tenant blogging system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Nav />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
