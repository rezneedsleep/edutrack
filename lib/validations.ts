import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
})

export const registerStudentSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  confirmPassword: z.string(),
  classRoom: z.string().min(1, 'Pilih kelas'),
  school: z.string().min(2, 'Nama sekolah minimal 2 karakter'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Password tidak sama',
  path: ['confirmPassword'],
})

export const registerTeacherSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  confirmPassword: z.string(),
  subject: z.string().min(1, 'Pilih mata pelajaran'),
  school: z.string().min(2, 'Nama sekolah minimal 2 karakter'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Password tidak sama',
  path: ['confirmPassword'],
})

export const progressLogSchema = z.object({
  subjectId: z.string().min(1, 'Pilih mata pelajaran'),
  topicId: z.string().min(1, 'Pilih topik'),
  duration: z.number().min(15, 'Minimal 15 menit').max(180, 'Maksimal 180 menit'),
  difficulty: z.number().min(1).max(5),
  notes: z.string().optional(),
})

export const scheduleSchema = z.object({
  subjectId: z.string().min(1, 'Pilih mata pelajaran'),
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format waktu tidak valid'),
  duration: z.number().min(15).max(180),
  recurring: z.boolean().default(true),
})

export const profileSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  school: z.string().optional(),
  classRoom: z.string().optional(),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, 'Password minimal 6 karakter'),
  newPassword: z.string().min(6, 'Password minimal 6 karakter'),
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'Password tidak sama',
  path: ['confirmNewPassword'],
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterStudentFormData = z.infer<typeof registerStudentSchema>
export type RegisterTeacherFormData = z.infer<typeof registerTeacherSchema>
export type ProgressLogFormData = z.infer<typeof progressLogSchema>
export type ScheduleFormData = z.infer<typeof scheduleSchema>
export type ProfileFormData = z.infer<typeof profileSchema>
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>
