import type { Metadata } from 'next'
import { Geist, Geist_Mono, Inter } from 'next/font/google'
import { Providers } from '@/components/providers'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
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
import DatabaseOfflinePage from "@/components/database-offline"
import { headers } from "next/headers"

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  let isDatabaseOffline = false
  let session = null
  let role = null
  let settings = null

  try {
    session = await auth()
    role = (session?.user as any)?.role
  } catch (error: any) {
    if (error.message?.includes("Can't reach database server") || error.message?.includes("PrismaClientInitializationError")) {
      console.warn("\x1b[33m⚠️ [RootLayout] Database is offline. Rendering database-offline warning page.\x1b[0m")
    } else {
      console.error('Database connection or auth error in RootLayout:', error)
    }
    isDatabaseOffline = true
  }

  const headerList = await headers()
  const currentPath = headerList.get('x-url') || ''
  
  if (!isDatabaseOffline) {
    try {
      settings = await prisma.settings.findUnique({
        where: { id: 'global' }
      })
    } catch (error: any) {
      if (error.message?.includes("Can't reach database server") || error.message?.includes("PrismaClientInitializationError")) {
        console.warn("\x1b[33m⚠️ [RootLayout] Database is offline (Prisma Settings query failed).\x1b[0m")
      } else {
        console.error('Database connection error in RootLayout settings query:', error)
      }
      isDatabaseOffline = true
    }
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
          {isDatabaseOffline ? (
            <DatabaseOfflinePage />
          ) : isMaintenance && !isAdmin && !isAuthPage ? (
            <MaintenancePage />
          ) : (
            children
          )}
        </Providers>
        {process.env.NODE_ENV === 'production' && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  )
}
