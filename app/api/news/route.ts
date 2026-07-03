import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 1. GET: Ambil semua berita
export async function GET() {
  try {
    const articles = await prisma.news.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(articles)
  } catch (error) {
    console.error("Gagal mengambil data berita:", error)
    return NextResponse.json([], { status: 500 })
  }
}

// 2. POST: Tambah berita baru
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, content } = body

    if (!title || !content) {
      return NextResponse.json({ error: 'Judul dan isi wajib diisi' }, { status: 400 })
    }

    const newArticle = await prisma.news.create({
      data: {
        title,
        content,
        author: 'Admin',
        published: true,
      },
    })
    return NextResponse.json(newArticle)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal menyimpan data' }, { status: 500 })
  }
}

// 3. PUT: Edit berita yang sudah ada
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, title, content } = body

    if (!id || !title || !content) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
    }

    const updatedArticle = await prisma.news.update({
      where: { id },
      data: { title, content },
    })
    return NextResponse.json(updatedArticle)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal memperbarui data' }, { status: 500 })
  }
}

// 4. DELETE: Hapus berita berdasarkan ID
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID tidak ditemukan' }, { status: 400 })
    }

    await prisma.news.delete({
      where: { id },
    })
    return NextResponse.json({ message: 'Berita berhasil dihapus' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal menghapus data' }, { status: 500 })
  }
}