import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Menjalankan seed khusus admin...')

  const adminHash = await bcrypt.hash('admin123', 10)
  const userHash = await bcrypt.hash('user123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@dalaranger08.id' },
    update: {
      password: adminHash,
      role: 'admin',
      name: 'Admin Dala Ranger',
    },
    create: {
      email: 'admin@dalaranger08.id',
      name: 'Admin Dala Ranger',
      password: adminHash,
      role: 'admin',
    },
  })

  const user = await prisma.user.upsert({
    where: { email: 'user@dalaranger08.id' },
    update: {
      password: userHash,
      role: 'user',
      name: 'User Dala Ranger',
    },
    create: {
      email: 'user@dalaranger08.id',
      name: 'User Dala Ranger',
      password: userHash,
      role: 'user',
    },
  })

  console.log('✅ Seed selesai dengan sukses!')
  console.log(`   Admin: ${admin.email}`)
  console.log(`   User:  ${user.email}`)
}

main()
  .catch(e => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())