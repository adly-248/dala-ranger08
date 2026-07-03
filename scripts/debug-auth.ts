import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
 
const prisma = new PrismaClient()
 
async function main() {
  console.log('\n🔍 Mengecek user di database...\n')
 
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, password: true },
  })
 
  if (users.length === 0) {
    console.log('❌ Tidak ada user di database! Menjalankan seed...\n')
    await seedUsers()
    return
  }
 
  for (const user of users) {
    const hasHash = user.password?.startsWith('$2') // bcrypt hash selalu diawali $2a$ atau $2b$
    console.log(`👤 ${user.email} | role: ${user.role} | password: ${hasHash ? '✅ bcrypt hash' : '❌ PLAIN TEXT atau kosong'}`)
  }
 
  // Cek apakah demo user sudah ada
  const adminExists = users.find(u => u.email === 'admin@dalaranger08.id')
  const userExists = users.find(u => u.email === 'user@dalaranger08.id')
 
  if (!adminExists || !userExists) {
    console.log('\n⚠️  Demo user belum lengkap. Membuat yang kurang...\n')
    await seedUsers()
  } else {
    // Cek apakah password sudah di-hash dengan benar
    const adminValid = adminExists.password?.startsWith('$2')
    const userValid = userExists.password?.startsWith('$2')
 
    if (!adminValid || !userValid) {
      console.log('\n⚠️  Password tidak di-hash! Memperbaiki...\n')
      await fixPasswords()
    } else {
      console.log('\n✅ Semua user sudah benar. Coba login lagi.')
      console.log('Kalau masih error, cek DATABASE_URL di .env kamu.\n')
    }
  }
 
  await prisma.$disconnect()
}
 
async function seedUsers() {
  const adminHash = await bcrypt.hash('admin123', 10)
  const userHash = await bcrypt.hash('user123', 10)
 
  await prisma.user.upsert({
    where: { email: 'admin@dalaranger08.id' },
    update: { password: adminHash, role: 'admin' },
    create: {
      email: 'admin@dalaranger08.id',
      name: 'Admin Dala Ranger',
      password: adminHash,
      role: 'admin',
    },
  })
 
  await prisma.user.upsert({
    where: { email: 'user@dalaranger08.id' },
    update: { password: userHash, role: 'user' },
    create: {
      email: 'user@dalaranger08.id',
      name: 'User Dala Ranger',
      password: userHash,
      role: 'user',
    },
  })
 
  console.log('✅ User berhasil dibuat/diperbarui:')
  console.log('   Admin: admin@dalaranger08.id / admin123')
  console.log('   User:  user@dalaranger08.id / user123\n')
}
 
async function fixPasswords() {
  const adminHash = await bcrypt.hash('admin123', 10)
  const userHash = await bcrypt.hash('user123', 10)
 
  await prisma.user.update({
    where: { email: 'admin@dalaranger08.id' },
    data: { password: adminHash },
  })
 
  await prisma.user.update({
    where: { email: 'user@dalaranger08.id' },
    data: { password: userHash },
  })
 
  console.log('✅ Password berhasil di-hash ulang!\n')
}
 
main().catch(e => {
  console.error('❌ Error:', e.message)
  prisma.$disconnect()
  process.exit(1)
})