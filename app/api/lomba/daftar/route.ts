import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { lombaId, name, phone, age, email, address } = body

    if (!lombaId || !name || !age) {
      return NextResponse.json({ error: 'Data pendaftaran tidak lengkap' }, { status: 400 })
    }

    const ageNum = parseInt(age)

    // 🌟 LOGIKA UTAMA: Penentuan Kategori Umur Otomatis oleh Sistem
    let kategori = 'Dewasa'
    if (ageNum < 12) {
      kategori = 'Anak-Anak'
    } else if (ageNum >= 12 && ageNum <= 17) {
      kategori = 'Remaja'
    }

    // Menggabungkan atau merekam data pendaftar ke kolom yang tersedia di CompetitionRegistration kamu
    const newParticipant = await prisma.competitionRegistration.create({
      data: {
        competitionId: lombaId,
        teamName: 'Individu', // Default karena daftar perorangan
        leaderName: name,
        leaderPhone: phone || '',
        leaderEmail: email || 'warga@dalaranger08.id',
        leaderAddress: address || 'Bandung',
        memberCount: 1,
        // Menyimpan data kategori umur otomatis ke dalam struktur string/JSON array members kamu
        members: JSON.stringify([{ name, age: ageNum, category: kategori }]), 
        status: 'pending',
      },
    })

    return NextResponse.json(newParticipant)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal melakukan pendaftaran' }, { status: 500 })
  }
}