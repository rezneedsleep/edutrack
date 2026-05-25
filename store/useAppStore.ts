import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  name: string
  email: string
  role: 'STUDENT' | 'TEACHER' | 'ADMIN' | 'COACH' | 'USER'
  school?: string
  classRoom?: string
  classId?: string
  avatar?: string
}

interface AppState {
  user: User | null
  sidebarOpen: boolean
  notifications: any[]
  setUser: (user: User | null) => void
  toggleSidebar: () => void
  setNotifications: (notifications: any[]) => void
  unreadNotificationCount: () => number
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      sidebarOpen: true,
      notifications: [],
      setUser: (user) => set({ user }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setNotifications: (notifications) => set({ notifications }),
      unreadNotificationCount: () => get().notifications.filter(n => !n.read).length,
    }),
    {
      name: 'edutrack-storage',
    }
  )
)
