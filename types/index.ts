export type Role = 'STUDENT' | 'TEACHER' | 'ADMIN'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  school?: string
  classRoom?: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export interface Subject {
  id: string
  name: string
  color: string
  teacherId?: string
  teacher?: User
  topics: Topic[]
  createdAt: Date
}

export interface Topic {
  id: string
  name: string
  order: number
  subjectId: string
  subject?: Subject
}

export interface ProgressLog {
  id: string
  userId: string
  user?: User
  topicId: string
  topic?: Topic
  duration: number // minutes
  difficulty: number // 1-5
  notes?: string
  loggedAt: Date
}

export interface UserSubject {
  id: string
  userId: string
  user?: User
  subjectId: string
  subject?: Subject
  targetHours: number
}

export interface Notification {
  id: string
  userId: string
  user?: User
  type: 'reminder' | 'alert' | 'achievement' | 'system'
  title: string
  message: string
  read: boolean
  createdAt: Date
}

export interface StudySchedule {
  id: string
  userId: string
  user?: User
  subjectId: string
  dayOfWeek: number // 0-6
  startTime: string // "08:00"
  duration: number // minutes
  recurring: boolean
}

export interface StatCard {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon: React.ComponentType<{ className?: string }>
}

export interface ProgressStatus {
  status: 'on-track' | 'lagging' | 'ahead'
  label: string
  color: string
}
