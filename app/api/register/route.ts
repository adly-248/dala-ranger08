import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
    }

    // 1. Cek apakah email sudah terdaftar di database
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: 'Email sudah terdaftar! Silahkan langsung login.' }, { status: 400 })
    }

    // 2. Enkripsi password menggunakan bcryptjs
    const hashedPassword = await bcrypt.hash(password, 10)

    // 3. Simpan user baru ke database
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'user', // Default role akun biasa umum
        pangkat: 'Warga Terdaftar', // Pangkat kustom pemisah
      },
    })

    return NextResponse.json({ message: 'Akun berhasil dibuat!', userId: newUser.id })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal membuat akun' }, { status: 500 })
  }
}