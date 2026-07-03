import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs' 

export const dynamic = 'force-dynamic'
export const revalidate = 0

// Di dalam file app/api/members/route.ts kamu, ganti bagian GET, POST, dan PUT-nya:

// 1. Ambil data
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        pangkat: true, // 🌟 Pastikan ini di-select agar dibaca frontend
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(users)
  } catch (error) {
    console.error(error)
    return NextResponse.json([], { status: 500 })
  }
}

// 2. Simpan baru
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password, role, pangkat } = body // 🌟 Tangkap pangkat

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role.toUpperCase(), // Memastikan tersimpan kapital (ADMIN/USER)
        pangkat: pangkat || 'Anggota Aktif', // 🌟 Taruh pangkat di sini
      },
    })
    return NextResponse.json(newUser)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal' }, { status: 500 })
  }
}

// 3. Edit data
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, name, email, role, pangkat } = body

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { 
        name, 
        email, 
        role: role.toUpperCase(), 
        pangkat: pangkat || 'Anggota Aktif' // 🌟 Update pangkat di sini
      },
    })
    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal' }, { status: 500 })
  }
}

// 4. DELETE: Tetap sama seperti kode kamu sebelumnya
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID dibutuhkan' }, { status: 400 })

    await prisma.competitionRegistration.deleteMany({ where: { userId: id } })
    await prisma.memberRegistration.deleteMany({ where: { userId: id } })
    await prisma.notification.deleteMany({ where: { userId: id } })

    await prisma.user.delete({ where: { id } })
    return NextResponse.json({ message: 'Anggota berhasil dihapus' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal menghapus anggota' }, { status: 500 })
  }
}