import { DiscussionForumClient } from '@/components/dashboard/discussion-forum-client'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Forum Diskusi',
}

export default function DiscussionsPage() {
  return <DiscussionForumClient />
}
