import { CalendarClient } from '@/components/dashboard/calendar-client'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kalender Akademik',
}

export default function CalendarPage() {
  return <CalendarClient />
}
