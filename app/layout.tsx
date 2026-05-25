import type { Metadata } from 'next'
import { Geist, Geist_Mono, Inter } from 'next/font/google'
import { Providers } from '@/components/providers'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  manifest: '/manifest.json',
  title: {
    default: 'EduTrack — Platform Monitoring Belajar Siswa',
    template: '%s | EduTrack',
  },
  description:
    'Platform monitoring kemajuan belajar siswa SMA/SMK secara real-time. Gratis, mudah, dan efektif untuk guru dan siswa Indonesia.',
  keywords: [
    'monitoring belajar',
    'platform pendidikan',
    'progress siswa',
    'edu tech indonesia',
    'aplikasi sekolah',
  ],
  authors: [{ name: 'EduTrack Team' }],
  creator: 'EduTrack',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://edutrack.id',
    title: 'EduTrack — Platform Monitoring Belajar Siswa',
    description:
      'Monitor kemajuan belajar siswa secara real-time. Gratis untuk semua sekolah di Indonesia.',
    siteName: 'EduTrack',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EduTrack — Platform Monitoring Belajar Siswa',
    description: 'Monitor kemajuan belajar siswa secara real-time.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
}

import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import MaintenancePage from "./maintenance/page"
import { headers } from "next/headers"

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  const role = (session?.user as any)?.role
  const headerList = await headers()
  const currentPath = headerList.get('x-url') || ''
  
  // Fetch global settings with error handling
  let settings = null
  try {
    settings = await prisma.settings.findUnique({
      where: { id: 'global' }
    })
  } catch (error) {
    console.error('Database connection error in RootLayout:', error)
  }

  const isMaintenance = settings?.maintenanceMode || false
  const isAdmin = role === 'ADMIN'
  const isAuthPage = currentPath === '/login' || currentPath.startsWith('/api')

  return (
    <html lang="id" suppressHydrationWarning className="bg-background" data-scroll-behavior="smooth">
      <body
        className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <Providers>
          {isMaintenance && !isAdmin && !isAuthPage ? (
            <MaintenancePage />
          ) : (
            children
          )}
        </Providers>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
