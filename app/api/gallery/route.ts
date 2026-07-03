import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// 1. GET: Ambil semua dokumentasi foto galeri
export async function GET() {
  try {
    const images = await prisma.gallery.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(images)
  } catch (error) {
    console.error(error)
    return NextResponse.json([], { status: 500 })
  }
}

// 2. POST: Mengunggah dokumentasi foto baru
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, imageUrl } = body

    if (!title || !imageUrl) {
      return NextResponse.json({ error: 'Judul dan File Foto wajib diisi' }, { status: 400 })
    }

    const newItem = await prisma.gallery.create({
      data: {
        title: title,
        category: description || '', 
        url: imageUrl,
        type: "photo" // Memastikan nilai default type terisi aman
      },
    })
    return NextResponse.json(newItem)
  } catch (error) {
    // 🌟 Penting: Menampilkan detail error asli di terminal VS Code kamu saat disubmit
    console.error("DETAIL ERROR PRISMA GALLERY:", error)
    return NextResponse.json({ error: 'Gagal mengunggah ke database. Pastikan kolom DB sudah LongText.' }, { status: 500 })
  }
}

// 3. PUT: Mengubah judul atau deskripsi galeri
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, title, description, imageUrl } = body

    const updated = await prisma.gallery.update({
      where: { id },
      data: {
        title,
        category: description || '', // 🌟 DIUBAH
        url: imageUrl,               // 🌟 DIUBAH
      },
    })
    return NextResponse.json(updated)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal memperbarui galeri' }, { status: 500 })
  }
}

// 4. DELETE: Menghapus foto dokumentasi dari database
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) return NextResponse.json({ error: 'ID dibutuhkan' }, { status: 400 })

    await prisma.gallery.delete({ where: { id } })
    return NextResponse.json({ message: 'Foto berhasil dihapus' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal menghapus foto' }, { status: 500 })
  }
}