import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Mengambil data warga terdaftar khusus untuk kompetisi ID ini
    const registrations = await prisma.competitionRegistration.findMany({
      where: { competitionId: id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(registrations)
  } catch (error) {
    console.error("Error get registrations:", error)
    return NextResponse.json([], { status: 500 })
  }
}