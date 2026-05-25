import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import { StudentDetailClient } from "@/components/dashboard/student-detail-client"

export const dynamic = 'force-dynamic'

export default async function StudentDetailPage(props: any) {
  // Menggunakan teknik yang terbukti berhasil di pengetesan
  const params = await props.params;
  const id = params?.id;

  if (!id) return notFound();

  const session = await auth();
  if (!session || !['ADMIN', 'TEACHER'].includes((session.user as any).role)) redirect("/dashboard");

  const student = await prisma.user.findUnique({
    where: { id },
    include: {
      class: true,
      studentSubmissions: {
        include: {
          assignment: {
            include: {
              subject: true
            }
          }
        },
        orderBy: { submittedAt: 'desc' }
      },
      progressLogs: {
        include: {
          topic: {
            include: {
              subject: true
            }
          }
        },
        orderBy: { loggedAt: 'desc' }
      },
      userSubjects: {
        include: {
          subject: true
        }
      },
      userNotes: {
        include: {
          author: true
        },
        orderBy: { createdAt: 'desc' }
      },
      attendances: {
        orderBy: { date: 'desc' }
      }
    }
  });

  if (!student) notFound();

  return (
    <StudentDetailClient student={student} />
  )
}
