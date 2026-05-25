import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { ScheduleClient } from "@/components/dashboard/schedule-client"

export default async function SchedulePage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const user = session.user as any
  const role = user.role
  const userId = user.id
  const classId = user.classId
  
  let schedules: any[] = []
  
  try {
    // STUDENT check: Ensure classId is a truthy string and not "null"/"undefined"
    if (role === 'STUDENT' && classId && classId !== "null" && classId !== "undefined") {
      schedules = await prisma.classSchedule.findMany({
        where: { 
          classId: {
            equals: String(classId)
          }
        },
        include: { 
          subject: true, 
          teacher: {
            select: {
              name: true,
              email: true,
              image: true
            }
          } 
        },
        orderBy: { startTime: 'asc' }
      })
    } 
    // TEACHER check: Ensure userId is a truthy string
    else if (role === 'TEACHER' && userId && userId !== "null" && userId !== "undefined") {
      schedules = await prisma.classSchedule.findMany({
        where: { 
          teacherId: {
            equals: String(userId)
          }
        },
        include: { 
          subject: true, 
          class: true,
          teacher: {
            select: {
              name: true,
              email: true,
              image: true
            }
          } 
        },
        orderBy: { startTime: 'asc' }
      })
    }
  } catch (error) {
    console.error("[SCHEDULE_PAGE_ERROR]", error)
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-primary font-black uppercase tracking-widest text-xs mb-2">Academic Calendar</p>
        <h1 className="text-5xl font-black uppercase italic tracking-tighter">Jadwal Pelajaran.</h1>
        <p className="text-zinc-500 font-medium mt-2">
          {role === 'TEACHER' ? 'Monitor jadwal mengajar Anda di berbagai kelas.' : 'Monitor jadwal belajar harian Anda.'}
        </p>
      </div>
      
      <ScheduleClient 
        schedules={schedules}
        role={role}
      />
    </div>
  )
}
